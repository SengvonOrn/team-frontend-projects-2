export default function ColorSelector({ value, onChange }: any) {
  const colors = ["Black", "White", "Gray", "Red"];

  return (
    <div>
      <p className="font-semibold mb-2">Color: {value}</p>
      <div className="flex gap-2">
        {colors.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`px-4 py-2 rounded border ${
              value === c ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
