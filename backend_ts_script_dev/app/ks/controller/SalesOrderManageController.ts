/**
 * SalesOrderManageController - 销售订单管理控制器
 *
 * 提供销售订单 CRUD 操作的 REST API 接口：
 * - 查询销售订单列表（支持按单据编号模糊搜索、分页）
 * - 新增销售订单
 * - 修改销售订单
 * - 删除销售订单
 *
 * 使用 SDK：
 * - QueryServiceHelper：查询服务助手
 * - QFilter / QCP：查询过滤条件与比较符
 * - SaveServiceHelper：保存服务助手
 * - DeleteServiceHelper：删除服务助手
 */

import { QFilter, QCP } from "@cosmic/bos-core/kd/bos/orm/query";
import { QueryServiceHelper } from "@cosmic/bos-core/kd/bos/servicehelper";
import { SaveServiceHelper } from "@cosmic/bos-core/kd/bos/servicehelper/operation";
import { DeleteServiceHelper } from "@cosmic/bos-core/kd/bos/servicehelper/operation";
import { BusinessDataServiceHelper } from "@cosmic/bos-core/kd/bos/servicehelper";

declare function BigInt(value: any): any;

/** 单据状态码 → 中文名映射 */
const STATUS_MAP: Record<string, string> = {
  A: "暂存",
  B: "已提交",
  C: "已审核",
  D: "已关闭",
};

/** 实体标识 */
const ENTITY_NUMBER = "kdtest_wenq_xsdd01";

class SalesOrderManageController {

  /**
   * 查询销售订单列表
   *
   * GET /query?keyword=xxx&page=1&pageSize=10
   */
  query(request: any, response: any) {
    try {
      const keyword = request.getStringQueryParam("keyword") || "";
      const page = request.getIntQueryParam("page") || 1;
      const pageSize = request.getIntQueryParam("pageSize") || 10;

      // 构造过滤条件
      let filters: any[] = [];
      if (keyword) {
        filters.push(new QFilter("billno", QCP.like, `%${keyword}%`));
      }

      // 查询总数
      let countData = QueryServiceHelper.query(ENTITY_NUMBER, "id", filters);
      let total = 0;
      if (countData) {
        total = countData.size();
      }

      // 查询列表数据（包含所有单头字段）
      let selectFields = "id,billno,billstatus,creator,modifier,auditor,auditdate,createtime,modifytime," +
        "kdtest_textfield4,kdtest_integerfield1,kdtest_decimalfield1,kdtest_bigintfield1," +
        "kdtest_textareafield,kdtest_largetextfield,kdtest_datefield,kdtest_datetimefield," +
        "kdtest_textfield5,kdtest_billstatusfield,kdtest_integerfield2";
      let datas = QueryServiceHelper.query(
        ENTITY_NUMBER,
        selectFields,
        filters,
        "createtime desc"
      );

      // 手动分页处理
      let startIndex = (page - 1) * pageSize;
      let list: any[] = [];

      if (datas) {
        let size = datas.size();
        let endIndex = Math.min(startIndex + pageSize, size);
        for (let i = startIndex; i < endIndex; i++) {
          let row = datas.get(i);
          let statusCode = (row.get("billstatus") || "A").toString();

          list.push({
            id: row.get("id").toString(),
            billno: (row.get("billno") || "").toString(),
            billstatus: statusCode,
            billstatusName: STATUS_MAP[statusCode] || ("未知(" + statusCode + ")"),
            creator: (row.get("creator") || "").toString(),
            modifier: (row.get("modifier") || "").toString(),
            auditor: (row.get("auditor") || "").toString(),
            auditdate: row.get("auditdate") ? row.get("auditdate").toString() : "",
            createtime: row.get("createtime") ? row.get("createtime").toString() : "",
            modifytime: row.get("modifytime") ? row.get("modifytime").toString() : "",
            kdtest_textfield4: (row.get("kdtest_textfield4") || "").toString(),
            kdtest_integerfield1: row.get("kdtest_integerfield1") != null ? row.get("kdtest_integerfield1").toString() : "",
            kdtest_decimalfield1: row.get("kdtest_decimalfield1") != null ? row.get("kdtest_decimalfield1").toString() : "",
            kdtest_bigintfield1: row.get("kdtest_bigintfield1") != null ? row.get("kdtest_bigintfield1").toString() : "",
            kdtest_textareafield: (row.get("kdtest_textareafield") || "").toString(),
            kdtest_largetextfield: (row.get("kdtest_largetextfield") || "").toString(),
            kdtest_datefield: row.get("kdtest_datefield") ? row.get("kdtest_datefield").toString() : "",
            kdtest_datetimefield: row.get("kdtest_datetimefield") ? row.get("kdtest_datetimefield").toString() : "",
            kdtest_textfield5: (row.get("kdtest_textfield5") || "").toString(),
            kdtest_billstatusfield: (row.get("kdtest_billstatusfield") || "").toString(),
            kdtest_integerfield2: row.get("kdtest_integerfield2") != null ? row.get("kdtest_integerfield2").toString() : "",
          });
        }
      }

      response.ok({
        data: JSON.stringify(list),
        total: total,
        page: page,
        pageSize: pageSize,
      });
    } catch (e: any) {
      response.throwException(
        "查询销售订单失败: " + e.message,
        500,
        "QUERY_ORDER_ERROR"
      );
    }
  }

  /**
   * 新增销售订单
   *
   * POST /create
   * Body: 包含所有单头可编辑字段
   */
  create(request: any, response: any) {
    try {
      const body = request.getMapBody();

      if (!body["billno"]) {
        response.throwException("单据编号不能为空", 400, "MISSING_BILLNO");
        return;
      }

      // 使用 BusinessDataServiceHelper 创建新的数据对象
      let dataObj = BusinessDataServiceHelper.newDynamicObject(ENTITY_NUMBER);
      dataObj.set("billno", body["billno"]);
      dataObj.set("billstatus", "A");

      // 文本类字段
      if (body["kdtest_textfield4"]) dataObj.set("kdtest_textfield4", body["kdtest_textfield4"]);
      if (body["kdtest_textfield5"]) dataObj.set("kdtest_textfield5", body["kdtest_textfield5"]);
      if (body["kdtest_textareafield"]) dataObj.set("kdtest_textareafield", body["kdtest_textareafield"]);
      if (body["kdtest_largetextfield"]) dataObj.set("kdtest_largetextfield", body["kdtest_largetextfield"]);

      // 数值类字段
      if (body["kdtest_integerfield1"] != null && body["kdtest_integerfield1"] !== "") dataObj.set("kdtest_integerfield1", parseInt(body["kdtest_integerfield1"]));
      if (body["kdtest_integerfield2"] != null && body["kdtest_integerfield2"] !== "") dataObj.set("kdtest_integerfield2", parseInt(body["kdtest_integerfield2"]));
      if (body["kdtest_decimalfield1"] != null && body["kdtest_decimalfield1"] !== "") dataObj.set("kdtest_decimalfield1", parseFloat(body["kdtest_decimalfield1"]));
      if (body["kdtest_bigintfield1"] != null && body["kdtest_bigintfield1"] !== "") dataObj.set("kdtest_bigintfield1", body["kdtest_bigintfield1"]);

      // 日期类字段
      if (body["kdtest_datefield"]) {
        dataObj.set("kdtest_datefield", new Date(body["kdtest_datefield"]));
      }
      if (body["kdtest_datetimefield"]) {
        dataObj.set("kdtest_datetimefield", new Date(body["kdtest_datetimefield"]));
      }

      // 保存数据
      let result = SaveServiceHelper.save([dataObj]);

      response.ok({
        success: true,
        message: "新增销售订单成功",
      });
    } catch (e: any) {
      response.throwException(
        "新增销售订单失败: " + e.message,
        500,
        "CREATE_ORDER_ERROR"
      );
    }
  }

  /**
   * 修改销售订单
   *
   * POST /update
   * Body: { id, billno, kdtest_datefield, billstatus }
   */
  update(request: any, response: any) {
    try {
      const body = request.getMapBody();

      if (!body["id"]) {
        response.throwException("订单ID不能为空", 400, "MISSING_ID");
        return;
      }

      // 加载已有数据对象（loadSingle 签名：entityNumber, selectFields, filters[]）
      let idLong = BigInt(body["id"].toString());
      let allFields = "id,billno,billstatus,kdtest_textfield4,kdtest_integerfield1," +
        "kdtest_decimalfield1,kdtest_bigintfield1,kdtest_textareafield,kdtest_largetextfield," +
        "kdtest_datefield,kdtest_datetimefield,kdtest_textfield5,kdtest_integerfield2";
      let updateFilters: any[] = [];
      updateFilters.push(new QFilter("id", QCP.equals, idLong));
      let dataObj = BusinessDataServiceHelper.loadSingle(
        ENTITY_NUMBER,
        allFields,
        updateFilters
      );

      if (!dataObj) {
        response.throwException("订单不存在", 404, "ORDER_NOT_FOUND");
        return;
      }

      // 更新字段
      if (body["billno"]) dataObj.set("billno", body["billno"]);
      if (body["billstatus"]) dataObj.set("billstatus", body["billstatus"]);

      // 文本类字段
      if (body["kdtest_textfield4"] !== undefined) dataObj.set("kdtest_textfield4", body["kdtest_textfield4"] || "");
      if (body["kdtest_textfield5"] !== undefined) dataObj.set("kdtest_textfield5", body["kdtest_textfield5"] || "");
      if (body["kdtest_textareafield"] !== undefined) dataObj.set("kdtest_textareafield", body["kdtest_textareafield"] || "");
      if (body["kdtest_largetextfield"] !== undefined) dataObj.set("kdtest_largetextfield", body["kdtest_largetextfield"] || "");

      // 数值类字段
      if (body["kdtest_integerfield1"] !== undefined) dataObj.set("kdtest_integerfield1", body["kdtest_integerfield1"] !== "" ? parseInt(body["kdtest_integerfield1"]) : 0);
      if (body["kdtest_integerfield2"] !== undefined) dataObj.set("kdtest_integerfield2", body["kdtest_integerfield2"] !== "" ? parseInt(body["kdtest_integerfield2"]) : 0);
      if (body["kdtest_decimalfield1"] !== undefined) dataObj.set("kdtest_decimalfield1", body["kdtest_decimalfield1"] !== "" ? parseFloat(body["kdtest_decimalfield1"]) : 0);
      if (body["kdtest_bigintfield1"] !== undefined) dataObj.set("kdtest_bigintfield1", body["kdtest_bigintfield1"] || "");

      // 日期类字段
      if (body["kdtest_datefield"]) dataObj.set("kdtest_datefield", new Date(body["kdtest_datefield"]));
      if (body["kdtest_datetimefield"]) dataObj.set("kdtest_datetimefield", new Date(body["kdtest_datetimefield"]));

      // 保存更新
      SaveServiceHelper.save([dataObj]);

      response.ok({
        success: true,
        message: "修改销售订单成功",
      });
    } catch (e: any) {
      response.throwException(
        "修改销售订单失败: " + e.message,
        500,
        "UPDATE_ORDER_ERROR"
      );
    }
  }

  /**
   * 删除销售订单
   *
   * POST /delete
   * Body: { id }
   */
  remove(request: any, response: any) {
    try {
      const body = request.getMapBody();

      if (!body["id"]) {
        response.throwException("订单ID不能为空", 400, "MISSING_ID");
        return;
      }

      // 直接使用 QFilter 删除（匹配 delete(String, QFilter[]) 重载）
      let idLong = BigInt(body["id"].toString());
      let deleteFilter = new QFilter("id", QCP.equals, idLong);
      DeleteServiceHelper.delete(ENTITY_NUMBER, [deleteFilter]);

      response.ok({
        success: true,
        message: "删除销售订单成功",
      });
    } catch (e: any) {
      response.throwException(
        "删除销售订单失败: " + e.message,
        500,
        "DELETE_ORDER_ERROR"
      );
    }
  }
}

let kwcController = new SalesOrderManageController();
export { kwcController };
