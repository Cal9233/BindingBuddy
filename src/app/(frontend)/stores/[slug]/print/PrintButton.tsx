"use client";

import Button from "@/components/ui/Button";

export default function PrintButton() {
  return (
    <Button variant="primary" onClick={() => window.print()}>
      Print QR Card
    </Button>
  );
}
