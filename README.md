# 💍 Wedding Luxury - موقع زفاف شخصي فاخر

موقع ويب شخصي خاص لعرض صور وفيديوهات الفرح بتصميم فاخر ورومانسي. الموقع محمي بكلمة مرور ويمكن مشاركته مع الأهل والأصدقاء.

## ✨ المميزات

- **تصميم فاخر** - واجهة مستخدم راقية بألوان ذهبية وبيج مع تأثيرات Glassmorphism
- **معرض صور Masonry** - عرض احترافي للصور بتنسيق شبكي متعدد الأعمدة
- **معرض فيديوهات** - عرض فيديوهات الفرح بشكل منظم
- **عد تنازلي** - عد تنازلي لموعد الفرح
- **موسيقى تصويرية** - إمكانية إضافة موسيقى خلفية اختيارية
- **حماية بكلمة مرور** - الموقع خاص ولا يمكن الدخول إلا بكلمة سر
- **رفع Drag & Drop** - رفع الصور والفيديوهات بسهولة عن طريق السحب والإفلات
- **ضغط تلقائي للصور** - تحسين جودة الصور وضغطها تلقائياً
- **لوحة تحكم كاملة** - إدارة المحتوى وتعديل النصوص والألوان
- **تصدير البيانات** - إمكانية تصدير جميع البيانات للنسخ الاحتياطي
- **Responsive Design** - تصميم متجاوب يعمل على جميع الأجهزة
- **Animations ناعمة** - حركات احترافية باستخدام Framer Motion

## 🛠 التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| Next.js 14 | إطار العمل الرئيسي |
| TypeScript | أمان الأنواع |
| Tailwind CSS | التصميم والتنسيق |
| Framer Motion | الحركات والانتقالات |
| Lucide React | الأيقونات |

## 🚀 طريقة التشغيل

### المتطلبات الأساسية

- Node.js 18+ 
- npm أو yarn

### الخطوات

```bash
# 1. تحميل المشروع
git clone https://github.com/your-username/wedding-luxury.git
cd wedding-luxury

# 2. تثبيت الحزم
npm install

# 3. تشغيل المشروع محلياً
npm run dev
```

الموقع سيعمل على `http://localhost:3000`

### بناء المشروع للتشغيل الفعلي

```bash
npm run build
npm start
```

## 🔐 كلمة المرور

افتراضيًا، كلمة المرور هي: `wedding2024`

لتغييرها، افتح ملف `.env.local` وعدّل القيمة:

```env
NEXT_PUBLIC_SITE_PASSWORD=كلمة_السر_الجديدة
```

### دخول المدير

لدخول لوحة التحكم، استخدم كلمة المرور مع إضافة `_admin` في النهاية:

- كلمة المرور العادية: `wedding2024`
- كلمة المرور للمدير: `wedding2024_admin`

## 📂 هيكل المشروع

```
wedding-luxury/
├── public/
│   ├── images/          # الصور الثابتة
│   └── music/           # ملفات الموسيقى
├── src/
│   ├── app/
│   │   ├── layout.tsx   # التخطيط الرئيسي
│   │   ├── page.tsx     # الصفحة الرئيسية
│   │   ├── globals.css  # الأنماط العامة
│   │   ├── dashboard/   # لوحة التحكم
│   │   ├── settings/    # الإعدادات
│   │   ├── gallery/     # معرض الصور
│   │   └── videos/      # الفيديوهات
│   ├── components/      # المكونات
│   ├── context/         # سياق التطبيق
│   ├── lib/             # المكتبات المساعدة
│   └── types/           # أنواع TypeScript
├── .env.local           # المتغيرات البيئية
└── package.json
```

## 🖼 رفع المشروع على GitHub

### الطريقة الأولى: عبر سطر الأوامر

```bash
# 1. إنشاء مستودع جديد على GitHub

# 2. ربط المستودع المحلي
git init
git add .
git commit -m "Initial commit"

# 3. ربط المستودع البعيد
git remote add origin https://github.com/your-username/wedding-luxury.git
git branch -M main
git push -u origin main
```

### الطريقة الثانية: نشر الموقع على GitHub Pages

1. ارفع المشروع إلى GitHub
2. اذهب إلى Settings > Pages في مستودعك
3. اختر GitHub Actions كالمصدر
4. أنشئ ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

ثم اذهب إلى Settings > Pages واختر "Deploy from a branch" واختر `gh-pages` branch.

## 🔑 إضافة GitHub Token

1. اذهب إلى [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. اضغط "Generate new token (classic)"
3. اختر الصلاحيات: `repo` (كاملة)
4. انسخ التوكن
5. ضع التوكن في ملف `.env.local`:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=wedding-luxury
GITHUB_BRANCH=main
```

## ☁️ رفع الصور وتخزينها

### التخزين المحلي (LocalStorage)

افتراضيًا، يتم تخزين الصور في متصفح المستخدم باستخدام LocalStorage. هذا مناسب للاختبار ولكن له حدود من حيث المساحة.

### Cloudinary

1. أنشئ حساب على [Cloudinary](https://cloudinary.com)
2. اذهب إلى Dashboard وانسخ Cloud Name
3. اذهب إلى Settings > Upload > Upload Presets وأنشئ preset جديد
4. ضع الإعدادات في لوحة التحكم > الإعدادات > التخزين

### Supabase Storage

1. أنشئ حساب على [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. اذهب إلى Storage وأنشئ bucket جديد باسم `wedding`
4. اذهب إلى Project Settings > API وانسخ URL و Anon Key
5. ضع الإعدادات في لوحة التحكم > الإعدادات > التخزين

## 🎨 تخصيص المظهر

من لوحة التحكم > الإعدادات > المظهر يمكنك تغيير:

- اللون الرئيسي (الذهبي افتراضيًا)
- لون الإظهار
- لون الخلفية
- لون النص

## 🎵 إضافة موسيقى

1. ارفع ملف MP3 على أي خدمة استضافة (مثل Cloudinary أو Supabase)
2. احصل على الرابط المباشر للملف
3. اذهب إلى لوحة التحكم > الإعدادات > الموسيقى
4. أضف الرابط وفعّل التشغيل

## 📱 استخدام الموقع

1. **الزوار**: يدخلون بكلمة المرور ويشاهدون المحتوى
2. **المدير**: يدخل بكلمة المرور + `_admin` ويمكنه رفع الصور والفيديوهات وتعديل الإعدادات
3. **المشاركة**: يمكن مشاركة رابط الموقع مع أي شخص مع كلمة المرور

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى فتح Issue أو Pull Request.

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License.
