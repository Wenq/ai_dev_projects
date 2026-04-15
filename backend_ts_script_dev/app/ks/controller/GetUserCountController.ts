/**
 * GetUserCountController - 人员数量查询控制器
 * 
 * 提供获取系统人员数量的 REST API 接口
 * 
 * 使用 SDK：
 * - QueryServiceHelper：查询服务助手
 * - QFilter：查询过滤条件
 */

import { QFilter } from "@cosmic/bos-core/kd/bos/orm/query";
import { QueryServiceHelper } from "@cosmic/bos-core/kd/bos/servicehelper";

class GetUserCountController {

  /**
   * 获取系统中启用状态的人员数量
   * 
   * GET /count
   */
  getUserCount(request: any, response: any) {
    try {
      // 构造过滤条件：只统计启用状态的人员
      let filters = [];
      filters.push(new QFilter("enable", "=", true));
      
      // 使用 QueryServiceHelper 查询人员数据，只查询 id 字段提升性能
      let datas = QueryServiceHelper.query("bos_user", "id", filters); 
      
      // 获取数据数量
      let count = 0;
      if (datas) {
        count = datas.size();
      } 
      
      response.ok({
        count: count,
        message: "获取人员数量成功",
        aa: 'wenq'
      });
    } catch (e) {
      response.throwException("获取人员数量失败: " + e.message, 500, "GET_USER_COUNT_ERROR");
    }
  }

  /**
   * 获取人员数量（支持按组织过滤）
   * 
   * GET /countByOrg?orgId=xxx
   */
  getUserCountByOrg(request: any, response: any) {
    try {
      const orgId = request.getStringQueryParam("orgId");
      
      // 构造过滤条件
      let filters = [];
      filters.push(new QFilter("enable", "=", true));
      
      // 如果指定了组织ID，添加组织过滤条件
      if (orgId) {
        filters.push(new QFilter("useorg.id", "=", orgId));
      }
      
      // 使用 QueryServiceHelper 查询人员数据
      let datas = QueryServiceHelper.query("bd_person", "id", filters);
      
      // 获取数据数量
      let count = 0;
      if (datas) {
        count = datas.size();
      }
      
      response.ok({
        count: count,
        orgId: orgId || null,
        message: "获取人员数量成功"
      });
    } catch (e) {
      response.throwException("获取人员数量失败: " + e.message, 500, "GET_USER_COUNT_BY_ORG_ERROR");
    }
  }
}

let kwcController = new GetUserCountController();
export { kwcController };
