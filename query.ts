import { assert, replaceParams } from "./deps.ts";

export class QueryBuilder {
  private _type: "select" | "insert" | "update" | "delete";
  private _table: string;
  private _where: string[] = [];
  private _joins: string[] = [];
  private _orders: string[] = [];
  private _fields: string[] = [];
  private _insertValues: Object[] = [];
  private _updateValue: Object;
  private _limit: { start: number; size: number };

  private get orderSQL() {
    if (this._orders && this._orders.length) {
      return `ORDER BY ` + this._orders.join(", ");
    }
  }

  private get whereSQL() {
    if (this._where && this._where.length) {
      return `WHERE ` + this._where.join(" AND ");
    }
  }

  private get joinSQL() {
    if (this._joins && this._joins.length) {
      return this._joins.join(" ");
    }
  }

  private get limitSQL() {
    if (this._limit) {
      return `LIMIT ${this._limit.start}, ${this._limit.size}`;
    }
  }

  private get selectSQL() {
    return [
      "SELECT",
      this._fields.join(", "),
      "FROM",
      replaceParams("??", [this._table]),
      this.joinSQL,
      this.whereSQL,
      this.orderSQL,
      this.limitSQL
    ]
      .filter(str => str)
      .join(" ");
  }

  private get insertSQL() {
    const len = this._insertValues.length;
    const fields = Object.keys(this._insertValues[0]);
    const values = this._insertValues.map(row => {
      return fields.map(key => row[key]);
    });
    return replaceParams(`INSERT INTO ?? ?? VALUES ${"? ".repeat(len)}`, [
      this._table,
      fields,
      ...values
    ]);
  }

  private get updateSQL() {
    assert(!!this._updateValue);
    const set = Object.keys(this._updateValue)
      .map(key => {
        return replaceParams(`?? = ?`, [key, this._updateValue[key]]);
      })
      .join(", ");
    return [
      replaceParams(`UPDATE ?? SET ${set}`, [this._table]),
      this.whereSQL
    ].join(" ");
  }

  private get deleteSQL() {
    return [replaceParams(`DELETE FROM ??`, [this._table]), this.whereSQL].join(
      " "
    );
  }

  table(name: string) {
    this._table = name;
    return this;
  }

  order(by: string, order: "DESC" | "ASC" | "desc" | "asc") {
    this._orders.push(replaceParams(`?? ${order.toUpperCase()}`, [by]));
    return this;
  }

  where(key: string, op: string, value?: any) {
    if (value) {
      this._where.push(replaceParams(`?? ${op} ?`, [key, value]));
    } else {
      this._where.push(replaceParams(`?? ${op}`, [key]));
    }
    return this;
  }

  limit(start: number, size: number) {
    this._limit = { start, size };
    return this;
  }

  join(join: string) {
    this._joins.push(join);
    return this;
  }

  select(...fields: string[]) {
    this._type = "select";
    assert(fields.length > 0);
    this._fields = fields.map(field => {
      if (field === "*") {
        return "*";
      } else if (field.toLocaleLowerCase().indexOf(" as ") > -1) {
        return field;
      } else if (field.split(".").length > 1) {
        return replaceParams("??.??", field.split("."));
      } else {
        return replaceParams("??", [field]);
      }
    });
    return this;
  }

  insert(data: Object[] | Object) {
    this._type = "insert";
    if (!(data instanceof Array)) {
      data = [data];
    }
    this._insertValues = data as [];
    return this;
  }

  update(data: Object) {
    this._type = "update";
    this._updateValue = data;
    return this;
  }

  delete(table?: string) {
    if (table) this._table = table;
    this._type = "delete";
    return this;
  }

  build(): string {
    assert(!!this._table);
    switch (this._type) {
      case "select":
        return this.selectSQL;
      case "insert":
        return this.insertSQL;
      case "update":
        return this.updateSQL;
      case "delete":
        return this.deleteSQL;
    }
  }
}
