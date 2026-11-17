// Source excerpts from INT504 feature/sprint2-final, commit fcd43c5.
window.pbi6Snippets = {
  "dialog": {
    "file": "frontend/my-schedule.html",
    "start": 58,
    "lines": [
      "  <dialog id=\"remove-dialog\" aria-labelledby=\"remove-message\">",
      "    <p id=\"remove-message\"></p>",
      "    <form method=\"dialog\">",
      "      <button type=\"submit\" value=\"cancel\" autofocus>Cancel</button>",
      "      <button type=\"submit\" value=\"remove\">Remove</button>",
      "    </form>",
      "  </dialog>"
    ],
    "highlight": [
      2,
      4
    ]
  },
  "action": {
    "file": "frontend/scripts/my-schedule.js",
    "start": 83,
    "lines": [
      "    const actionCell = row.insertCell();",
      "",
      "    if (withSelect) {",
      "      const button = document.createElement(\"button\");",
      "      button.type = \"button\";",
      "      button.textContent = \"Select\";",
      "      button.addEventListener(\"click\", () => selectSection(s));",
      "      actionCell.append(button);",
      "    } else {",
      "      const selected = selectedSection[s.course.id] === s.section;",
      "",
      "      //Dusit",
      "      const removeButton = createRemoveButton(s, {",
      "        selected,",
      "        onConfirm: removeSelection,",
      "      });",
      "      if (removeButton) actionCell.append(removeButton);",
      "",
      "      //Phurin",
      "      const changeButton = createChangeButton(s, {",
      "        selected,",
      "        otherSections: otherSectionsOf(s),",
      "        onConfirm: changeSection,",
      "      });",
      "      if (changeButton) actionCell.append(\" \", changeButton);",
      "    }"
    ],
    "highlight": [
      9,
      14,
      16,
      22
    ]
  },
  "button": {
    "file": "frontend/scripts/remove-selection.js",
    "start": 1,
    "lines": [
      "//Dusit",
      "export function createRemoveButton(schedule, { selected, onConfirm }) {",
      "  if (!selected || schedule.fixed) {",
      "    return null;",
      "  }",
      "",
      "  const button = document.createElement(\"button\");",
      "  button.type = \"button\";",
      "  button.textContent = \"Remove\";",
      "",
      "  button.addEventListener(\"click\", () => {",
      "    const dialog = document.querySelector(\"#remove-dialog\");",
      "    if (dialog.open) {",
      "      return;",
      "    }",
      "",
      "    const { course, section } = schedule;",
      "    dialog.querySelector(\"#remove-message\").textContent =",
      "      `Remove ${course.code} ${course.title} section ${section}?`;",
      "",
      "    dialog.returnValue = \"\";",
      "    dialog.showModal();",
      "    dialog.addEventListener(\"close\", () => {",
      "      if (dialog.returnValue === \"remove\") {",
      "        onConfirm(course.id);",
      "      }",
      "    }, { once: true });",
      "  });",
      "",
      "  return button;",
      "}"
    ],
    "highlight": [
      2,
      20,
      23,
      24
    ]
  },
  "request": {
    "file": "frontend/scripts/my-schedule.js",
    "start": 186,
    "lines": [
      "async function removeSelection(courseId) {",
      "  let res;",
      "  try {",
      "    res = await fetch(\"api/v1/students/\" + studentId + \"/selections/\" + courseId, {",
      "      method: \"DELETE\",",
      "    });",
      "  } catch (error) {",
      "    console.error(error);",
      "    showMessage(PROBLEM, null);",
      "    return;",
      "  }",
      "",
      "  if (res.status === 204) {",
      "    delete selectedSection[courseId];",
      "    render();",
      "  } else if (res.status === 404) {",
      "    showMessage(NOT_IN_SCHEDULE, rereadSelections);",
      "  } else {",
      "    showMessage(PROBLEM, null);",
      "  }",
      "}"
    ],
    "highlight": [
      4,
      13,
      15,
      16
    ]
  },
  "message": {
    "file": "frontend/scripts/my-schedule.js",
    "start": 35,
    "lines": [
      "function showMessage(text, afterClosed) {",
      "  document.getElementById(\"message-text\").textContent = text;",
      "  afterMessageClosed = afterClosed;",
      "  document.getElementById(\"message-dialog\").showModal();",
      "}"
    ],
    "highlight": [
      2
    ]
  },
  "messageClose": {
    "file": "frontend/scripts/my-schedule.js",
    "start": 264,
    "lines": [
      "const messageDialog = document.getElementById(\"message-dialog\");",
      "document.getElementById(\"message-ok\").addEventListener(\"click\", () => messageDialog.close());",
      "messageDialog.addEventListener(\"close\", () => {",
      "  const next = afterMessageClosed;",
      "  afterMessageClosed = null;",
      "  if (next) {",
      "    next();",
      "  }",
      "});"
    ],
    "highlight": [
      2,
      6
    ]
  },
  "route": {
    "file": "backend/server.js",
    "start": 27,
    "lines": [
      "app.delete(\"/api/v1/students/:studentId/selections/:courseId\", removeSelection);"
    ],
    "highlight": [
      0
    ]
  },
  "controller": {
    "file": "backend/src/controllers/student-controller.js",
    "start": 33,
    "lines": [
      "export async function removeSelection(req, res) {",
      "  const { studentId, courseId } = req.params;",
      "  const id = Number(courseId);",
      "  if (!Number.isInteger(id)) {",
      "    return res.status(404).json({ message: \"This course is not in your schedule.\" });",
      "  }",
      "",
      "  try {",
      "    const student = await getStudent(studentId);",
      "    if (student === null || !await deleteSelection(student.studentId, id)) {",
      "      return res.status(404).json({ message: \"This course is not in your schedule.\" });",
      "    }",
      "",
      "    return res.status(204).end();",
      "  } catch (error) {",
      "    console.error(\"Failed to remove selection:\", error);",
      "    return res.status(500).json({ message: \"Internal server error\" });",
      "  }",
      "}"
    ],
    "highlight": [
      3,
      9,
      13
    ]
  },
  "prisma": {
    "file": "backend/src/services/student-service.js",
    "start": 62,
    "lines": [
      "export async function deleteSelection(studentId, courseId) {",
      "  const { count } = await prisma.selections.deleteMany({",
      "    where: { student_id: studentId, course_id: courseId },",
      "  });",
      "",
      "  return count > 0;",
      "}"
    ],
    "highlight": [
      1,
      2,
      5
    ]
  },
  "render": {
    "file": "frontend/scripts/my-schedule.js",
    "start": 113,
    "lines": [
      "function render() {",
      "  const mySchedule = [];",
      "  const coursesToChoose = [];",
      "",
      "  for (const s of schedules) {",
      "    const courseId = s.course.id;",
      "",
      "    if (s.fixed) {",
      "      mySchedule.push(s);",
      "    } else if (selectedSection[courseId] === s.section) {",
      "      mySchedule.push(s);",
      "    } else if (selectedSection[courseId] === undefined) {",
      "      coursesToChoose.push(s);",
      "    }",
      "  }",
      "",
      "  fillTable(\"my-schedule-body\", mySchedule, false);",
      "  document.querySelector('[data-testid=\"my-schedule-empty\"]').hidden = mySchedule.length > 0;",
      "",
      "  fillTable(\"options-body\", coursesToChoose, true);",
      "  document.getElementById(\"options-block\").hidden = coursesToChoose.length === 0;",
      "}"
    ],
    "highlight": [
      9,
      11,
      12,
      16,
      19
    ]
  },
  "changeButton": {
    "file": "frontend/scripts/change-section.js",
    "start": 3,
    "lines": [
      "export function createChangeButton(schedule, { selected, otherSections, onConfirm }) {",
      "  if (!selected || schedule.fixed || otherSections.length === 0) {",
      "    return null;",
      "  }",
      "",
      "  const button = document.createElement(\"button\");",
      "  button.type = \"button\";",
      "  button.textContent = \"Change\";",
      "",
      "  button.addEventListener(\"click\", () => {",
      "    const dialog = document.querySelector(\"#change-dialog\");",
      "    if (dialog.open) {",
      "      return;",
      "    }",
      "",
      "    const { course } = schedule;",
      "    dialog.querySelector(\"#change-message\").textContent = `Change ${course.code} section`;",
      "",
      "    const options = dialog.querySelector(\"#change-options\");",
      "    const confirm = dialog.querySelector(\"#change-confirm\");",
      "    options.replaceChildren();",
      "    confirm.disabled = true;",
      "",
      "    for (const s of otherSections) {",
      "      const label = document.createElement(\"label\");",
      "      const radio = document.createElement(\"input\");",
      "      radio.type = \"radio\";",
      "      radio.name = \"section\";",
      "      radio.value = s.section;",
      "      radio.addEventListener(\"change\", () => { confirm.disabled = false; });",
      "      label.append(",
      "        radio,",
      "        `Section ${s.section}: ${formatDay(s.dayOfWeek)} ${formatClock(s.startTime)}-${formatClock(s.endTime)}`,",
      "      );",
      "      options.append(label);",
      "    }",
      "",
      "    dialog.returnValue = \"\";",
      "    dialog.showModal();",
      "    dialog.addEventListener(\"close\", () => {",
      "      if (dialog.returnValue === \"change\") {",
      "        const chosen = Number(options.querySelector(\"input:checked\").value);",
      "        onConfirm(course.id, chosen);",
      "      }",
      "    }, { once: true });",
      "  });",
      "",
      "  return button;",
      "}"
    ],
    "highlight": [
      0,
      1,
      21,
      23,
      29,
      40,
      42
    ]
  },
  "change": {
    "file": "frontend/scripts/my-schedule.js",
    "start": 209,
    "lines": [
      "async function changeSection(courseId, section) {",
      "  let res;",
      "  try {",
      "    res = await fetch(\"api/v1/students/\" + studentId + \"/selections/\" + courseId, {",
      "      method: \"PUT\",",
      "      headers: { \"Content-Type\": \"application/json\" },",
      "      body: JSON.stringify({ section }),",
      "    });",
      "  } catch (error) {",
      "    console.error(error);",
      "    showMessage(PROBLEM, null);",
      "    return;",
      "  }",
      "",
      "  if (res.status === 200) {",
      "    selectedSection[courseId] = section;",
      "    render();",
      "  } else if (res.status === 404) {",
      "    showMessage(CHANGE_NOT_FOUND, rereadSelections);",
      "  } else {",
      "    showMessage(PROBLEM, null);",
      "  }",
      "}"
    ],
    "highlight": [
      4,
      14,
      15,
      16
    ]
  }
};
