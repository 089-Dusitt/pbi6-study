"use strict";

const $ = (selector) => document.querySelector(selector);
const course = { id: 45, code: "LNG202", title: "Basic Reading for Science and Technology" };
const fixed = { code: "INT134", title: "System Deployment", section: 1 };
const options = [7, 8, 9, 10];
const requestPath = "/api/v1/students/{studentId}/selections";
const trail = $("#trail");
const confirmDialog = $("#confirm-dialog");
const noticeDialog = $("#notice-dialog");
const changeDialog = $("#lab-change-dialog");
let selectedSection = {};
let serverSelections = {};

function element(tag, value, className) {
  const node = document.createElement(tag);
  if (value !== undefined) node.textContent = value;
  if (className) node.className = className;
  return node;
}

function addTrail(layer, explanation) {
  const row = document.createElement("li");
  row.append(element("span", layer, "trace-layer"), element("span", explanation));
  trail.append(row);
}

function showStatus(value) {
  $("#sim-status").textContent = value;
}

function row({ code, title, section }, action, focus = false) {
  const tr = element("tr", undefined, focus ? "row-focus" : "");
  const nameCell = element("td", code);
  nameCell.append(element("small", title));
  const actionCell = element("td");
  actionCell.append(action);
  tr.append(nameCell, element("td", section), actionCell);
  return tr;
}

function button(label, callback, primary = false) {
  const node = element("button", label, primary ? "button primary" : "button");
  node.type = "button";
  node.addEventListener("click", callback);
  return node;
}

function render() {
  const mine = $("#my-rows");
  const available = $("#choice-rows");
  mine.replaceChildren(row(fixed, "Fixed"));
  available.replaceChildren();
  const current = selectedSection[course.id];
  if (current) {
    const actions = element("div", undefined, "row-actions");
    actions.append(
      button("Remove", () => openRemove(current), true),
      button("Change", () => openChange(current)),
    );
    mine.append(row({ ...course, section: current }, actions, true));
    const empty = element("td", "LNG202 ถูกเลือกไว้แล้ว");
    empty.colSpan = 3;
    const tr = element("tr");
    tr.append(empty);
    available.append(tr);
  } else {
    for (const section of options) {
      const select = button("Select", () => selectSection(section));
      select.setAttribute("aria-label", "Select LNG202 section " + section);
      available.append(row({ ...course, section }, select));
    }
  }
  $("#selection-value").textContent = current === undefined ? "{}" : "{ 45: " + current + " }";
}

function selectSection(section) {
  trail.replaceChildren();
  serverSelections[course.id] = section;
  selectedSection[course.id] = section;
  render();
  $("#my-rows button").focus();
  addTrail("PBI5 / POST", requestPath + " ส่ง { courseId: 45, section: " + section + " } → 201 Created");
  addTrail("Frontend", "selectedSection[45] = " + section + " แล้ว render() แถวที่เลือกจึงปรากฏใน My Schedule");
  showStatus("เลือก LNG202 section " + section + " แล้ว ลองกด Remove ได้");
}

function openChange(current) {
  trail.replaceChildren();
  const choices = $("#lab-change-options");
  const confirm = $("#lab-change-confirm");
  choices.replaceChildren();
  confirm.disabled = true;

  for (const section of options) {
    if (section === current) continue;
    const label = element("label");
    const radio = element("input");
    radio.type = "radio";
    radio.name = "new-section";
    radio.value = section;
    const time = section <= 8 ? "08:30-09:30" : "09:30-10:30";
    label.append(radio, "Section " + section + ": Friday " + time);
    choices.append(label);
  }

  changeDialog.returnValue = "";
  changeDialog.showModal();
  addTrail("PBI7 / Change", "เปิดกล่องเลือก section อื่นของ LNG202");
}

$("#lab-change-options").addEventListener("change", () => {
  $("#lab-change-confirm").disabled = false;
});

changeDialog.addEventListener("close", () => {
  if (changeDialog.returnValue !== "change") {
    addTrail("ปิดกล่อง Change", "ไม่มีคำขอ PUT และค่า selectedSection เท่าเดิม");
    return;
  }

  const section = Number(changeDialog.querySelector("input:checked").value);
  serverSelections[course.id] = section;
  selectedSection[course.id] = section;
  render();
  $("#my-rows button").focus();
  addTrail("PBI7 / PUT", requestPath + "/" + course.id + " ส่ง { section: " + section + " } → 200 OK");
  addTrail("Frontend", "selectedSection[45] = " + section + " แล้ว render() สร้างปุ่ม Remove จากแถวใหม่");
  showStatus("เปลี่ยนเป็น section " + section + " แล้ว ลองเปิด Remove เพื่อดูข้อความยืนยัน");
});

function openRemove(section) {
  trail.replaceChildren();
  addTrail("Frontend", "พบ selection ของ LNG202 และแถวนี้ไม่เป็น Fixed จึงมีปุ่ม Remove");
  addTrail("HTML", "เปิด <dialog> พร้อมชื่อวิชาและ section " + section + " แล้วรอผู้ใช้");
  $("#confirm-message").textContent = "Remove " + course.code + " " + course.title + " section " + section + "?";
  confirmDialog.returnValue = "";
  confirmDialog.showModal();
}

function notice(message, afterClosed) {
  $("#notice-message").textContent = message;
  noticeDialog.addEventListener("close", afterClosed, { once: true });
  noticeDialog.showModal();
}

confirmDialog.addEventListener("close", () => {
  const answer = confirmDialog.returnValue;
  confirmDialog.returnValue = "";
  if (answer !== "remove") {
    addTrail("ปิดกล่องยืนยัน", (answer === "cancel" ? "Cancel" : "Esc") + ": ไม่มีคำขอ DELETE และค่า selectedSection เท่าเดิม");
    showStatus("ยกเลิกแล้ว ตารางยังเหมือนเดิม");
    return;
  }
  const outcome = $("input[name='scenario']:checked").value;
  addTrail("Frontend / DELETE", requestPath + "/" + course.id + " (ไม่มี body)");
  addTrail("Express", "อ่าน studentId และ courseId จาก req.params แล้วเรียก controller");
  if (outcome === "204") {
    delete serverSelections[course.id];
    addTrail("Prisma", "deleteMany() ตาม student_id และ course_id ได้ count = 1");
    addTrail("HTTP 204", "สำเร็จ ไม่มี response body");
    delete selectedSection[course.id];
    render();
    $("#choice-rows button").focus();
    addTrail("Frontend", "delete selectedSection[45] แล้วเรียก render() ทุก section ของ LNG202 จึงกลับมาเป็นตัวเลือก");
    showStatus("ลบสำเร็จ: LNG202 กลับไปอยู่ใน Courses to Choose");
  } else if (outcome === "404") {
    delete serverSelections[course.id];
    addTrail("HTTP 404", "สมมติว่ารายการถูกลบจากที่อื่นแล้ว: Prisma คืน count = 0 หน้าเว็บยังมีข้อมูลเก่า");
    showStatus("กด OK หรือ Esc เพื่อปิดข้อความและอ่านรายการล่าสุดจาก backend");
    notice("This course is not in your schedule.", () => {
      addTrail("PBI4 / GET", "rereadSelections() อ่าน " + requestPath + " → []");
      selectedSection = { ...serverSelections };
      render();
      $("#choice-rows button").focus();
      addTrail("Frontend", "rememberSelections() เอาข้อมูลล่าสุดมาใส่ selectedSection แล้ว render() วาดสองตาราง");
      showStatus("อ่านรายการล่าสุดแล้ว: LNG202 กลับมาให้เลือก");
    });
  } else {
    addTrail("HTTP 500", "จำลองข้อผิดพลาดของ backend ก่อนบันทึก");
    notice("There is a problem. Please try again later.", () => {
      addTrail("Frontend", "แสดงข้อความผิดพลาดและเก็บค่า selectedSection เดิม ให้ลองใหม่ได้");
      showStatus("LNG202 ยังอยู่ใน My Schedule");
    });
  }
});

function reset() {
  selectedSection = { [course.id]: options[0] };
  serverSelections = { [course.id]: options[0] };
  $("input[name='scenario'][value='204']").checked = true;
  trail.replaceChildren();
  addTrail("พร้อมทดลอง", "ตัวอย่างเริ่มจากเลือก LNG202 section 7 ไว้แล้ว");
  showStatus("ลองกด Change ที่ LNG202 แล้วเปิด Remove เพื่อดู section ใหม่");
  render();
}

for (const figure of document.querySelectorAll("[data-source]")) {
  const snippet = window.pbi6Snippets?.[figure.dataset.source];
  if (!snippet) continue;
  const caption = element("figcaption", snippet.file + " : " + snippet.start);
  const pre = element("pre");
  pre.tabIndex = 0;
  pre.setAttribute("aria-label", "ตัวอย่างโค้ด " + snippet.file);
  const code = element("code");
  for (const [index, line] of snippet.lines.entries()) {
    const span = element("span", undefined, "code-line" + (snippet.highlight.includes(index) ? " here" : ""));
    const number = element("b", snippet.start + index);
    number.setAttribute("aria-hidden", "true");
    span.append(number, document.createTextNode(line));
    code.append(span);
    if (index < snippet.lines.length - 1) code.append("\n");
  }
  pre.append(code);
  figure.append(caption, pre);
}

$("#reset").addEventListener("click", reset);
reset();

