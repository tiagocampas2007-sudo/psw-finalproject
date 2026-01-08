"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Brand {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export default function BrandSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`, { cache: "no-store" });
        if (!res.ok) throw new Error("Erro a carregar marcas");
        const data: Brand[] = await res.json();
        setBrands(data);
      } catch (err) {
        console.error("Erro ao carregar marcas", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-neutral-500">
        A carregar marcas...
      </div>
    );
  }

  if (error || !brands.length) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-neutral-500">
        Não foi possível carregar as marcas
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">

      <div className="flex w-max animate-slider gap-6">
        {[...brands, ...brands].map((brand, i) => (
          <div
            key={`${brand.slug}-${i}`}
            className="relative h-30 w-30 shrink-0 overflow-hidden"
            title={brand.name}
          >
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              unoptimized
              sizes="156px"
              className="object-contain p-6 grayscale transition-all duration-500 hover:grayscale-0 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
