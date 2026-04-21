"use client";

import { useState } from "react";
import Button from "./ui/Button";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function AddToCartButton({ 
  productId, 
  quantity = 1, 
  label = "Agregar al Carrito",
  className = "",
  disabled = false,
  fullWidth = true
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
      });
      
      const json = await res.json();
      if (json.success) {
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Producto agregado al carrito exitosamente");
      } else {
        alert(json.error || "Error al agregar al carrito");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAdd} 
      disabled={disabled || loading} 
      className={className} 
      size="lg"
      fullWidth={fullWidth}
    >
      {loading ? "Agregando..." : label}
    </Button>
  );
}
