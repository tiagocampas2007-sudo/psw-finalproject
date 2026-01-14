"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/components/BrandSlider.css";

import { getBrands } from "@/lib/api";
import type { Brand } from "@/lib/api/brands/brands.types";

export default function BrandSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        console.error("Erro ao carregar marcas", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadBrands();
  }, []);

  if (loading) {
    return (
      <div className="brand-status">
        A carregar marcas...
      </div>
    );
  }

  if (error || !brands.length) {
    return (
      <div className="brand-status">
        Não foi possível carregar as marcas
      </div>
    );
  }

  return (
    <div className="brand-slider">
      <div className="brand-track">
        {[...brands, ...brands].map((brand, i) => (
          <div
            key={`${brand.slug}-${i}`}
            className="brand-item"
            title={brand.name}
          >
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              unoptimized
              sizes="156px"
              className="brand-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
