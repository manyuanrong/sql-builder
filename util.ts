export function replaceParams(sql: string, params: any | any[]): string {
  if (!params) return sql;
  let paramIndex = 0;
  sql = sql.replace(/('.*')|(".*")|(\?\?)|(\?)/g, (str) => {
    if (paramIndex >= params.length) return str;
    // ignore
    if (/".*"/g.test(str) || /'.*'/g.test(str)) {
      return str;
    }
    // identifier
    if (str === "??") {
      const val = params[paramIndex++];
      if (val instanceof Array) {
        return `(${val.map((item) => replaceParams("??", [item])).join(",")})`;
      } else if (val === "*") {
        return val;
      } else if (typeof val === "string" && val.indexOf(".") > -1) {
        // a.b => `a`.`b`
        const _arr = val.split(".");
        return replaceParams(_arr.map(() => "??").join("."), _arr);
      } else if (
        typeof val === "string" &&
        (val.toLowerCase().indexOf(" as ") > -1 ||
          val.toLowerCase().indexOf(" AS ") > -1)
      ) {
        // a as b => `a` AS `b`
        const newVal = val.replace(" as ", " AS ");
        const _arr = newVal.split(" AS ");
        return replaceParams(_arr.map(() => "??").join(" AS "), _arr);
      } else {
        return ["`", val, "`"].join("");
      }
    }
    // value
    const val = params[paramIndex++];
    if (val === null) return "NULL";
    switch (typeof val) {
      case "object":
        if (val instanceof Date) return `"${formatDate(val)}"`;
        if (val instanceof Array) {
          return `(${val.map((item) => replaceParams("?", [item])).join(",")})`;
        }
      case "string":
        return `"${escapeString(val)}"`;
      case "undefined":
        return "NULL";
      case "number":
      case "boolean":
      default:
        return val;
    }
  });
  return sql;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const days = date
    .getDate()
    .toString()
    .padStart(2, "0");
  const hours = date
    .getHours()
    .toString()
    .padStart(2, "0");
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const seconds = date
    .getSeconds()
    .toString()
    .padStart(2, "0");
  return `${year}-${month}-${days} ${hours}:${minutes}:${seconds}`;
}

function escapeString(str: string) {
  return str.replace(/"/g, '\\"');
}
