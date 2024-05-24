'use client'

export const Loader = () => {
  return (
    <div
      className="
        fixed top-0 left-0 w-full h-full 
        flex items-center justify-center
        bg-white bg-opacity-80 z-50 
      "
    >
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};
