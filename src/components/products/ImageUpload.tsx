// components/products/ImageUpload.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  uploadProductImagesAction,
  deleteProductImageAction,
} from "@/lib/action/products";
import { ImageType, ProductImage } from "@/types/addProducts";
import { Progress } from "@radix-ui/react-progress";

interface ImageUploadProps {
  productId: string;
  existingImages?: ProductImage[];
  onUploadComplete?: () => void;
}

export default function ImageUpload({
  productId,
  existingImages = [],
  onUploadComplete,
}: ImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update images when existingImages prop changes
  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await uploadFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      // Simulate progress (replace with actual progress tracking if available)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadProductImagesAction(productId, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data) {
        setImages(result.data.images || []);
        setSuccess(`Successfully uploaded ${files.length} image(s)`);
        onUploadComplete?.();

        // Reset progress after success
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        setError(result.error || "Failed to upload images");
      }
    } catch (err) {
      setError("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    setDeleting(imageId);
    setError(null);

    try {
      const result = await deleteProductImageAction(imageId);

      if (result.success) {
        setImages(images.filter((img) => img.id !== imageId));
        setSuccess("Image deleted successfully");
        onUploadComplete?.();
      } else {
        setError(result.error || "Failed to delete image");
      }
    } catch (err) {
      setError("An error occurred while deleting the image");
    } finally {
      setDeleting(null);
    }
  };

  const handleSetMainImage = (imageId: string) => {
    const updatedImages: ProductImage[] = images.map((img) => ({
      ...img,
      imageType: img.id === imageId ? ImageType.MAIN : ImageType.GALLERY,
    }));

    setImages(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const getImageTypeLabel = (imageType?: string) => {
    switch (imageType) {
      case "MAIN":
        return "Main";
      case "THUMBNAIL":
        return "Thumbnail";
      case "GALLERY":
        return "Gallery";
      default:
        return "Gallery";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed ${
          uploading ? "border-primary" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Upload Product Images
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag & drop images here or click to browse
            </p>

            <Button
              type="button"
              onClick={handleFileSelect}
              disabled={uploading}
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Images
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />

            <p className="text-xs text-muted-foreground mt-4">
              Supports JPG, PNG, WebP up to 10MB each
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Images ({images.length})</CardTitle>
            <CardDescription>
              Drag to reorder. First image is the main product image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-square bg-muted">
                    <img
                      src={image.imageUrl}
                      alt={image.altText || "Product image"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleSetMainImage(image.id)}
                      disabled={image.imageType === "MAIN"}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          image.imageType === "MAIN"
                            ? "fill-yellow-400 text-yellow-400"
                            : ""
                        }`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deleting === image.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Image Type Badge */}
                  <Badge
                    className={`absolute top-2 left-2 ${
                      image.imageType === "MAIN"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {getImageTypeLabel(image.imageType)}
                  </Badge>

                  {/* Loading Overlay */}
                  {deleting === image.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State for Gallery */}
            {images.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No images uploaded yet</p>
              </div>
            )}

            {/* Image Info */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Image Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First image will be used as the main product image</li>
                <li>• Recommended size: 1200x1200 pixels</li>
                <li>• Use high-quality, well-lit images</li>
                <li>• Show product from multiple angles</li>
                <li>• Include lifestyle images if possible</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
