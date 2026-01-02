export default function SizeSelector({ value, onChange }: any) {
  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div>
      <p className="font-semibold mb-2">Size: {value}</p>
      <div className="flex gap-2">
        {sizes.map(s => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`px-4 py-2 rounded border ${
              value === s ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
