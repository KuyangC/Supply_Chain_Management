/**
 * Shipment Detail Modal
 * Shows when clicking on an incoming shipment
 * Allows manager to confirm receipt with product type and quantity
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  PRODUCT_TYPE_CONFIG,
  SHIPMENT_STATUS_CONFIG,
} from "@/lib/constants";
import { AlertCircle, CheckCircle2, Package } from "lucide-react";

interface ShipmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: {
    id: string;
    from: string;
    to: string;
    product: string;
    quantity: number;
    date: string;
    status?: string;
  };
  onConfirm: (data: { quantity: number; type: string }) => void;
}

export function ShipmentDetailModal({
  isOpen,
  onClose,
  shipment,
  onConfirm,
}: ShipmentDetailModalProps) {
  const [quantity, setQuantity] = useState(shipment.quantity.toString());
  const [productType, setProductType] = useState<"raw" | "finished">("raw");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    // Call API with quantity and type
    onConfirm({
      quantity: parseInt(quantity) || 0,
      type: productType,
    });
    // In real app, wait for API response then close
    setTimeout(() => {
      setIsConfirming(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Shipment Details</DialogTitle>
          <DialogDescription>
            Confirm receipt of incoming shipment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Shipment Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{shipment.id}</p>
              <p className="text-sm text-gray-500">
                From: {shipment.from} → To: {shipment.to}
              </p>
            </div>
            {shipment.status && (
              <Badge
                className={
                  SHIPMENT_STATUS_CONFIG[
                    shipment.status.toLowerCase() as keyof typeof SHIPMENT_STATUS_CONFIG
                  ]?.bgColor || "bg-gray-100"
                }
              >
                {shipment.status}
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Product</span>
              <span className="font-medium text-gray-900">{shipment.product}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{shipment.date}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Quantity Sent</span>
              <span className="font-medium text-gray-900">
                {shipment.quantity.toLocaleString("en-US")} pcs
              </span>
            </div>
          </div>

          {/* Confirmation Form */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-[#3b82f6]" />
              <p className="text-sm text-blue-800">
                Please verify and confirm the received items
              </p>
            </div>

            {/* Product Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="product-type">Product Type</Label>
              <Select value={productType} onValueChange={(v: any) => setProductType(v)}>
                <SelectTrigger id="product-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Raw Material
                    </div>
                  </SelectItem>
                  <SelectItem value="finished">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Finished Goods
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Received */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Received</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                max={shipment.quantity * 1.1} // Allow slight overage
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Expected: {shipment.quantity.toLocaleString("en-US")} pcs
              </p>
            </div>

            {/* Show warning if quantity differs */}
            {parseInt(quantity) !== shipment.quantity && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-xs text-amber-800">
                  {parseInt(quantity) || 0 < shipment.quantity
                    ? "Receiving less than sent quantity"
                    : "Receiving more than sent quantity"}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming || !quantity || parseInt(quantity) <= 0}
            className="bg-[#10b981] hover:bg-[#059669] text-white"
          >
            {isConfirming ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 animate-pulse" />
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm Receipt
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
