let url =
  "https://script.google.com/macros/s/AKfycbwvUkbD3iT6RODq0hg1ZddMhCaWoMP9eZJnE0f6CqY9C2Wc_9aw-4_rXJlfcQYTgzeEJA/exec";

let records = null;

function add_record(name, time, step, 关卡) {
  $.ajax({
    url: url,
    data: { fun: "add_record", name: name, time: time, step: step, 关卡: 关卡 },
    success: response => {
      get_records(show_records);
    },
  });
}

function get_records(recall) {
  $.ajax({
    url: url,
    data: { fun: "get_records" },
    success: response => {
      records = JSON.parse(response);
      recall();
    },
  });
}

function show_records(sort = "time") {
  if (!records) return -1;
  sort_records(records, sort);
  const tbody = document.querySelector("#ranking tbody");
  $("#ranking tr:not(:first)").remove();
  let i = 1;
  for (let record of records) {
    if (record[4] === 关卡) {
      let tr = document.createElement("tr");
      tbody.appendChild(tr);

      let tr_content = [i].concat(record.slice(0, 3));
      tr_content.push(timestamp_to_date(record[3]));

      for (let value of tr_content) {
        let td = document.createElement("td");
        td.innerHTML = value;
        tr.appendChild(td);
      }
      i++;
    }
  }
}

function sort_records(records, sort) {
  if (sort === "name") {
    records.sort((a, b) => {
      const [name1, name2] = [a[0], b[0]];
      if (name1 > name2) return 1;
      if (name2 > name1) return -1;
      return 0;
    });
  } else if (sort === "time") {
    records.sort((a, b) => a[1] - b[1]);
  } else if (sort === "step") {
    records.sort((a, b) => a[2] - b[2]);
  } else if (sort === "date") {
    records.sort((a, b) => b[3] - a[3]);
  } else if (sort === "关卡") {
    records.sort((a, b) => {
      const [关卡1, 关卡2] = [a[4], b[4]];
      if (关卡1 > 关卡2) return 1;
      if (关卡2 > 关卡1) return -1;
      return 0;
    });
  }
}

function timestamp_to_date(timestamp) {
  const date = new Date(timestamp); // 参数需要毫秒数，所以这里将秒数乘于 1000
  Y = date.getFullYear() + "-";
  M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  D = date.getDate() + " ";
  h = date.getHours() + ":";
  m = date.getMinutes() + ":";
  s = date.getSeconds();
  return Y + M + D + h + m + s;
}

get_records(show_records);
