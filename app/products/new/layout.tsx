import type { Metadata } from 'next';

// This metadata object will be used by Next.js to set the <title> tag in the HTML's <head>.
export const metadata: Metadata = {
  title: 'Add Product/Category',
  description: 'add new products and new category',
};

// The layout component wraps your page components.
export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* The content of your app/products/page.tsx will be rendered here */}
      {children}
    </>
  );
}
