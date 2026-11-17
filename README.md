# ติวสอบ PBI6 Remove

อิง Sprint 2 Final `fcd43c5` · อ่านจากมือถือได้ในหน้านี้

- [ใครรับผิดชอบอะไร](#ใครรับผิดชอบอะไร)
- [อธิบายงานของตัวเอง](#อธิบายงานของตัวเอง)
- [คำถามซ้อมสอบ](#คำถามซ้อมสอบ)
- [โค้ดที่ควรชี้](#โค้ดที่ควรชี้)

## ใครรับผิดชอบอะไร

| คน | งานและจุดเชื่อม |
|---|---|
| **Dusit** | PBI6 Remove ทั้งปุ่ม กล่องยืนยัน ส่ง DELETE จัดการผล และลบรายการเลือกในฐานข้อมูล มีส่วนทำ Sign In/Out ใน PBI3 |
| **Kongpop** | PBI4 โหลดและแสดง My Schedule และ API ของ PBI5 Select โค้ด Remove ใช้ `fillTable()` กับ `render()` ของเขา |
| **Phurin** | PBI7 Change Section มีส่วนในหน้าตารางรวม ตัวกรองชั้นปี และ PBI3 พอ Change สำเร็จ ตารางถูกวาดใหม่ ทำให้กล่อง Remove แสดง section ล่าสุด |

## อธิบายงานของตัวเอง

> ผมทำ PBI6 Remove ครับ ตอนวาดตาราง `fillTable()` ของเพื่อนเรียก `createRemoveButton()` ของผมเพื่อสร้างปุ่มให้แถวที่เลือกเอง พอยืนยัน ปุ่มจะเรียก `removeSelection(courseId)` ให้ส่ง DELETE เมื่อ Backend ตอบ 204 ผมจะลบคีย์ใน `selectedSection` แล้วเรียก `render()` ของเพื่อนเพื่อวาดทั้งสองตารางใหม่ครับ

**ตาม Flow**  
`index.html` → `my-schedule.html` → `fillTable()` → `createRemoveButton()` → กล่องยืนยัน → `removeSelection()` ส่ง DELETE → Backend ลบรายการ → `render()` วาดตาราง

- **Cancel หรือ Esc ในกล่องยืนยัน** ปิดกล่องโดยไม่ส่ง DELETE
- **204** ลบสำเร็จ แถวหายจาก My Schedule และทุก section ที่เลือกได้ของวิชานั้นกลับไปที่ Courses to Choose
- **404** แจ้งว่าไม่พบรายการ แล้วอ่านข้อมูลล่าสุดเมื่อปิดกล่องด้วย OK หรือ Esc
- **500** แสดงข้อความทั่วไปโดยเก็บข้อมูลตารางเดิมไว้

## คำถามซ้อมสอบ

ลองตอบเองก่อนแตะเปิดแต่ละข้อ

<details>
<summary><strong>ทำไมส่ง onConfirm: removeSelection โดยไม่ใส่วงเล็บ?</strong></summary>

ตอนสร้างปุ่ม เราแค่ส่งฟังก์ชันให้เก็บไว้ก่อน พอผู้ใช้ยืนยันจึงเรียก `onConfirm(course.id)` ซึ่งเท่ากับ `removeSelection(course.id)`

</details>

<details>
<summary><strong>ทำไมต้องล้าง returnValue และใช้ once: true?</strong></summary>

Esc ปิดกล่องโดยไม่ได้ส่งค่าปุ่ม จึงต้องล้างค่าจากครั้งก่อนเพื่อกัน `"remove"` ค้าง ส่วน `once: true` เอาตัวฟังออกหลังปิดกล่องหนึ่งครั้ง เพื่อกันตัวฟังหลายรอบสะสม

</details>

<details>
<summary><strong>ทำไม 204 วาดใหม่ทันที แต่ 404 ต้องอ่านข้อมูลใหม่?</strong></summary>

204 คือ Backend ยืนยันว่าลบแล้ว หน้าเว็บจึงแก้ข้อมูลที่จำไว้ได้ ส่วน 404 อาจเกิดเพราะข้อมูลหน้าเราเก่า เช่น ถูกลบจากอีกแท็บ เลยอ่านรายการใหม่หลังปิดกล่องข้อความ

</details>

<details>
<summary><strong>ทำไมลบ section 7 แล้ว section อื่นกลับมาให้เลือก?</strong></summary>

`{ 45: 7 }` หมายถึงวิชา ID 45 เลือก section 7 พอลบคีย์ 45 แล้ว `render()` จะเห็นว่าวิชานี้ยังไม่ได้เลือก จึงแสดงทุก section ที่มีสิทธิ์เลือก

</details>

<details>
<summary><strong>หลัง Change ทำไมกล่อง Remove แสดง section ใหม่?</strong></summary>

Change เขียน section ใหม่ลง `selectedSection` แล้วเรียก `render()` ปุ่มที่สร้างจากแถวใหม่จึงใช้ section ปัจจุบัน

</details>

## โค้ดที่ควรชี้

1. **`my-schedule.js` บรรทัด 97** ส่งฟังก์ชันด้วย `onConfirm: removeSelection`
2. **`remove-selection.js` บรรทัด 25** เรียก `onConfirm(course.id)` เมื่อกดยืนยัน
3. **`my-schedule.js` บรรทัด 198 ถึง 200** ลบคีย์และเรียก `render()` เมื่อได้ 204

[ดูตัวอย่างโค้ดและเลขบรรทัดใน repo](./snippets.js) · [ไฟล์ต้นฉบับเว็บ Study](./index.html)

