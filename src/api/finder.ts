import { BannedMaterial } from "../types/minjust-types";
import { minjustApi } from "./api";
import * as cheerio from "cheerio";

export const minjustFinder = {
  async search(title: string, limit: number = 20): Promise<BannedMaterial[]> {
    const response = await minjustApi.get(`?q=${encodeURIComponent(title)}`);
    const html = response.data;

    const $ = cheerio.load(html);
    const rows = $("table tbody tr")
      .slice(1)
      .map((_, el) => {
        const cells = $(el).find("td").map((_, td) => $(td).text().trim()).get();
        const id = parseInt(cells[0], 10);
        let fullTitle = cells[1] ?? "";

        const match = fullTitle.match(/\(решение\s+(.+?)\s+от\s+(\d{2}\.\d{2}\.\d{4})\)/i);
        const court = match ? match[1] : undefined;
        const decisionDate = match ? match[2] : undefined;

        if (match) {
          fullTitle = fullTitle.replace(match[0], "").trim();
        }

        return {
          id,
          title: fullTitle,
          court,
          decisionDate
        };
      })
      .get();

    return limit ? rows.slice(0, limit) : rows;
  }
};
