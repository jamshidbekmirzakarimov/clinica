# Clinica & Omborxona CRM Frontend

Bu loyiha **Klinika tizimi** (API orqali) va **Omborxona/CRM tizimini** (to'g'ridan-to'g'ri Supabase orqali) o'z ichiga olgan yagona portaldir.

## O'rnatish va Ishga tushirish

1. Ushbu papkaga (client) kiring va kutubxonalarni o'rnating:
   ```bash
   npm install
   ```

2. Muhit o'zgaruvchilarini sozlang:
   `.env.example` faylidan nusxa oling va yangi `.env` faylini yarating:
   ```bash
   cp .env.example .env
   ```

3. **Supabase kalitlarini kiritish:**
   - [Supabase dashboard](https://supabase.com/dashboard) saytiga kiring.
   - Loyihangiz sozlamalaridan (Project Settings -> API) quyidagilarni oling:
     - **Project URL** -> Buni `.env` dagi `VITE_SUPABASE_URL` ga yozing.
     - **Project API Keys (anon, public)** -> Buni `.env` dagi `VITE_SUPABASE_ANON_KEY` ga yozing.

4. Lokal serverni ishga tushiring:
   ```bash
   npm run dev
   ```

5. Brauzerda http://localhost:5173 (yoki ko'rsatilgan port) orqali kiring. Asosiy sahifada ikkita tizimni tanlash oynasi chiqadi.
