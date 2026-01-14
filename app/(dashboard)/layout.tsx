export default function DashboardLayout({
  children,
  navbar
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
}) {
  return (
    <>
      {navbar}
      {children}
    </>
  );
}
