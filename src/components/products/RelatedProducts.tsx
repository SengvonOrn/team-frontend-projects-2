import Link from "next/link";
import { productsData } from "@/constants/productsData";

export default function RelatedProducts({ currentProductId }: any) {
  const related = productsData.filter(p => p.id !== currentProductId).slice(0, 4);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map(p => (
          <Link key={p.id} href={`/products/${p.id}`}>
            <div className="border rounded-xl overflow-hidden hover:shadow-lg">
              <img src={p.image} className="aspect-square object-cover" />
              <div className="p-3">
                <p className="font-semibold">{p.name}</p>
                <p className="text-orange-600 font-bold">${p.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
