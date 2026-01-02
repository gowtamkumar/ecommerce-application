# 🎨 Dynamic Theme System Guide

This project uses a powerful **Dynamic Theme System** that allows administrators to control the website's appearance directly from the Dashboard without touching code.

## 🚀 How It Works

1.  **Dashboard Configuration**: Settings are managed in `/dashboard/general-setting?tab=appearance`.
2.  **Database Storage**: Values are saved in the `Appearance` settings object.
3.  **Global Injection (`layout.tsx`)**: On app load, `layout.tsx` reads these settings and injects them as standard CSS variables (e.g., `--global-primary`) into the `:root` scope.
4.  **Tailwind Integration**: `tailwind.config.ts` maps these CSS variables to Tailwind utility classes.
5.  **Ant Design Theme**: `ConfigProvider` maps these same variables to Ant Design tokens, ensuring UI components (Buttons, Inputs, etc.) match automatically.

---

## 🛠 Class List (Cheatsheet)

Use these utility classes in your components. They will automatically adapt to the user's dashboard settings.

### 🎨 Backgrounds
| Class Name | Description | Dashboard Setting |
| :--- | :--- | :--- |
| `bg-global-bg` | Main Page Background | **Page Background** |
| `bg-global-card-bg` | Content/Card Background | **Card Background** |
| `bg-global-primary` | Brand Color Background | **Primary Color** |
| `bg-global-secondary` | Secondary/Dark Background | **Secondary Color** |
| `bg-global-hover` | Interactive Hover Background | **Hover Color** |
| `bg-global-button-primary` | **(NEW)** Custom Button Background | **Button Primary Color** (defaults to Primary) |
| `bg-global-button-hover` | **(NEW)** Custom Button Hover | **Button Hover Color** (defaults to Hover) |

### ✍️ Text Color
| Class Name | Description | Dashboard Setting |
| :--- | :--- | :--- |
| `text-global-text` | Main Body Text | **Default Text Color** |
| `text-global-primary` | Brand Colored Text | **Primary Color** |
| `text-global-accent` | Accent Text | **Accent Color** |

### 🔠 Typography (Fonts)
| Class Name | Description | Dashboard Setting |
| :--- | :--- | :--- |
| `font-global-primary-fontfamily` | Headings/Titles | **Primary Font** |
| `font-global-secondary-fontfamily`| Body/UI Text | **Secondary Font** |

### 📏 Typography (Sizes)
| Class Name | Description | Dashboard Setting |
| :--- | :--- | :--- |
| `text-global-size-h1` | Hero/Page Titles | **H1 Size** |
| `text-global-size-h2` | Section Titles | **H2 Size** |
| `text-global-size-h3` | Subtitles | **H3 Size** |
| `text-global-size-p` | Body Text | **Global Scale** / **P Size** |
| `text-global-size-h4` | *Fallback to H3* | N/A |

### 🔘 Custom Button Example
To create a custom button that fully respects specific button settings:

```tsx
<button className="
  bg-global-button-primary 
  hover:bg-global-button-hover 
  text-white 
  font-global-secondary-fontfamily
  px-6 py-2 
  rounded-lg
  transition-colors
">
  Dynamic Button
</button>
```

## 🧩 Ant Design Integration
Ant Design components (`<Button>`, `<Input>`, `<Select>`) are **automatically themed**. You do not need to add classes to them unless you need to override the defaults.

*   **Primary Color**: Updates all Ant primary buttons and active states.
*   **Border Radius**: Updates all Ant inputs and buttons.
*   **Font**: Updates the entire Ant component library font.
