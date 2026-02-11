export default function Loading() {
  // A simple static orange screen to bridge the gap while the server fetches data
  return (
    <div className="fixed inset-0 z-[9999] bg-main flex items-center justify-center">
      {/* You can leave this empty or add a small spinner if you want */}
    </div>
  );
}