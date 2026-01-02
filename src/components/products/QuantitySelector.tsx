import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange }: any) {
  return (
    <div>
      <p className="font-semibold mb-2">Quantity</p>
      <div className="flex items-center border rounded w-fit">
        <button onClick={() => value > 1 && onChange(value - 1)} className="p-2">
          <Minus />
        </button>
        <span className="px-6 font-bold">{value}</span>
        <button onClick={() => onChange(value + 1)} className="p-2">
          <Plus />
        </button>
      </div>
    </div>
  );
}
