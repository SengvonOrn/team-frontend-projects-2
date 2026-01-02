"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewForm() {
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-4">
      {/* TEXTAREA */}
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="min-h-[120px] bg-gray-800 text-white border-gray-700 placeholder:text-gray-400 focus-visible:ring-orange-500"
      />

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-700">
          <Image
            src={preview}
            alt="Review Preview"
            fill
            className="object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-black"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {/* ACTIONS */}
      <div className="flex items-center justify-between">
        {/* IMAGE UPLOAD */}
        <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
          <ImageIcon size={18} />
          <span className="text-sm">Add image</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        {/* SUBMIT */}
        <Button className="bg-orange-500 hover:bg-orange-600 text-white flex gap-2">
          <Send size={16} />
          Submit Review
        </Button>
      </div>
    </div>
  );
}
