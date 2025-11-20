interface FloatingButtonProps {
  onClick: () => void;   // 부모에게 클릭 알림
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-20 z-80 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
    >
      +
    </button>
  );
};

export default FloatingButton;