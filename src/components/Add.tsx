"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';

export default function Add() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !phone.trim() || !details.trim()) {
      setMessage("من فضلك املأ جميع البيانات");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        customerName: name.trim(),
        phone: phone.trim(),
        details: details.trim(),
        status: "new",
        createdAt: serverTimestamp(),
      });

      setMessage("تم إرسال الطلب بنجاح");
      setName("");
      setPhone("");
      setDetails("");
    } catch (error) {
      console.error("Firebase order error:", error);
      setMessage(
        error instanceof Error
          ? `فشل إرسال الطلب: ${error.message}`
          : "حدث خطأ أثناء إرسال الطلب"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitOrder} dir="rtl">
      <h2>إرسال طلب جديد</h2>

      <label htmlFor="customerName">اسم العميل</label>
      <input
        id="customerName"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="phone">رقم الهاتف</label>
      <input
        id="phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <label htmlFor="details">تفاصيل الطلب</label>
      <textarea
        id="details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "جارٍ إرسال الطلب..." : "إرسال الطلب"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}
