/**
 * SalesOrderDashboardController - 费用申请单仪表盘控制器
 *
 * 提供费用申请单统计数据的 REST API 接口：
 * - 按单据状态分组统计申请单数量
 * - 最近 7 天费用申请趋势
 *
 * 使用 SDK：
 * - QueryServiceHelper：查询服务助手
 * - QFilter / QCP：查询过滤条件与比较符
 */

import { QFilter, QCP } from "@cosmic/bos-core/kd/bos/orm/query";
import { QueryServiceHelper } from "@cosmic/bos-core/kd/bos/servicehelper";

/** 单据状态码 → 中文名映射 */
const STATUS_MAP: Record<string, string> = {
  A: "暂存",
  B: "已提交",
  C: "已审核",
  D: "已关闭",
};

class SalesOrderDashboardController {

  /**
   * 获取费用申请单按单据状态的汇总统计
   *
   * GET /statusSummary
   * 响应示例：
   * {
   *   summary: [
   *     { status: "A", label: "暂存", count: 12 },
   *     { status: "C", label: "已审核", count: 58 }
   *   ],
   *   total: 70
   * }
   */
  getStatusSummary(request: any, response: any) {
    try {
      // 查询所有费用申请单的 id 和 billstatus
      let datas = QueryServiceHelper.query("er_dailyapplybill", "id,billstatus", []);

      // 按状态分组计数
      let countMap: Record<string, number> = {};
      let total = 0;

      if (datas) {
        let size = datas.size();
        for (let i = 0; i < size; i++) {
          let row = datas.get(i);
          let status = (row.get("billstatus") || "A").toString();
          if (!countMap[status]) {
            countMap[status] = 0;
          }
          countMap[status] = countMap[status] + 1;
          total = total + 1;
        }
      }

      // 构造返回数组
      let summary: Array<{ status: string; label: string; count: number }> = [];
      let keys = Object.keys(countMap);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        summary.push({
          status: key,
          label: STATUS_MAP[key] || ("未知(" + key + ")"),
          count: countMap[key],
        });
      }

      response.ok({ summary: JSON.stringify(summary), total: total });
    } catch (e: any) {
      response.throwException(
        "获取申请单状态统计失败: " + e.message,
        500,
        "STATUS_SUMMARY_ERROR"
      );
    }
  }

  /**
   * 获取最近 7 天的费用申请单趋势数据
   *
   * GET /salesTrend
   * 响应示例：
   * {
   *   trend: [
   *     { date: "2026-03-27", count: 5 },
   *     { date: "2026-03-28", count: 8 },
   *     ...
   *   ]
   * }
   */
  getSalesTrend(request: any, response: any) {
    try {
      // 计算 1 年前的日期
      let now = new Date();
      let oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      // 构造日期过滤条件：bizdate >= 1年前
      let filters = [];
      filters.push(new QFilter("bizdate", QCP.large_equals, oneYearAgo));

      // 查询费用申请单的 id 和 bizdate
      let datas = QueryServiceHelper.query("er_dailyapplybill", "id,bizdate", filters);

      // 按月份分组计数（yyyy-MM）
      let countMap: Record<string, number> = {};

      if (datas) {
        let size = datas.size();
        for (let i = 0; i < size; i++) {
          let row = datas.get(i);
          let bizdate = row.get("bizdate");
          let monthStr = "";
          if (bizdate) {
            let d = new Date(bizdate.toString());
            let year = d.getFullYear();
            let month = (d.getMonth() + 1).toString().padStart(2, "0");
            monthStr = year + "-" + month;
          }
          if (monthStr) {
            if (!countMap[monthStr]) {
              countMap[monthStr] = 0;
            }
            countMap[monthStr] = countMap[monthStr] + 1;
          }
        }
      }

      // 补齐最近 12 个月数据（无申请单的月份补 0）
      let trend: Array<{ date: string; count: number }> = [];
      let curYear = now.getFullYear();
      let curMonth = now.getMonth(); // 0-based
      for (let i = 11; i >= 0; i--) {
        let totalMonths = curYear * 12 + curMonth - i;
        let year = Math.floor(totalMonths / 12);
        let month = (totalMonths % 12) + 1;
        let monthStr = year + "-" + month.toString().padStart(2, "0");
        trend.push({
          date: monthStr,
          count: countMap[monthStr] || 0,
        });
      }

      response.ok({ trend: JSON.stringify(trend) });
    } catch (e: any) {
      response.throwException(
        "获取费用申请趋势失败: " + e.message,
        500,
        "SALES_TREND_ERROR"
      );
    }
  }
}

let kwcController = new SalesOrderDashboardController();
export { kwcController };
