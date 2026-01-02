// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { MapPin, Navigation, Save, X, Image } from "lucide-react";

// type LocationData = {
//   latitude: number | null;
//   longitude: number | null;
//   address: string;
//   city: string;
//   country: string;
// };

// // interface LocationTrackerProps {
// //   currentLocation: LocationData | null;
// //   onLocationUpdate: (locationData: LocationData) => void;
// //   saving: boolean;
// // }
// interface LocationTrackerProps {
//   currentLocation: LocationData | null;
//   onLocationUpdate: (locationData: LocationData) => void;
//   onSave: (location: LocationData, icon?: File | null) => void;
//   saving: boolean;
// }

// interface SearchResult {
//   lat: string;
//   lon: string;
//   display_name: string;
//   address: {
//     city?: string;
//     town?: string;
//     village?: string;
//     country?: string;
//   };
// }

// const LocationTracker: React.FC<LocationTrackerProps> = ({
//   currentLocation,
//   onLocationUpdate,
//   saving,
// }) => {
//   const [location, setLocation] = useState<LocationData>(
//     currentLocation || {
//       latitude: null,
//       longitude: null,
//       address: "",
//       city: "",
//       country: "",
//     }
//   );

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

//   /* 🖼️ Custom icon */
//   const [iconFile, setIconFile] = useState<File | null>(null);
//   const [iconPreview, setIconPreview] = useState<string | null>(null);

//   /* Leaflet refs */
//   const mapRef = useRef<any>(null);
//   const markerRef = useRef<any>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);

//   /* Sync external location */
//   useEffect(() => {
//     if (currentLocation) setLocation(currentLocation);
//   }, [currentLocation]);

//   /* Load & init map */
//   useEffect(() => {
//     if (!location.latitude || !location.longitude) return;

//     const loadLeaflet = async () => {
//       if (!document.getElementById("leaflet-css")) {
//         const link = document.createElement("link");
//         link.id = "leaflet-css";
//         link.rel = "stylesheet";
//         link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
//         document.head.appendChild(link);
//       }

//       if (!(window as any).L) {
//         const script = document.createElement("script");
//         script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
//         script.onload = createMap;
//         document.body.appendChild(script);
//       } else {
//         createMap();
//       }
//     };

//     const createMap = () => {
//       const L = (window as any).L;
//       if (!L || !mapContainerRef.current) return;

//       const icon = iconPreview
//         ? L.icon({
//             iconUrl: iconPreview,
//             iconSize: [42, 42],
//             iconAnchor: [21, 42],
//           })
//         : undefined;

//       if (!mapRef.current) {
//         mapRef.current = L.map(mapContainerRef.current).setView(
//           [location.latitude!, location.longitude!],
//           15
//         );

//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           maxZoom: 19,
//           attribution: "© OpenStreetMap",
//         }).addTo(mapRef.current);

//         markerRef.current = L.marker(
//           [location.latitude!, location.longitude!],
//           {
//             draggable: true,
//             ...(icon && { icon }),
//           }
//         ).addTo(mapRef.current);

//         markerRef.current.on("dragend", (e: any) => {
//           const pos = e.target.getLatLng();
//           updateLocationFromCoords(pos.lat, pos.lng);
//         });

//         mapRef.current.on("click", (e: any) => {
//           const { lat, lng } = e.latlng;
//           markerRef.current.setLatLng([lat, lng]);
//           updateLocationFromCoords(lat, lng);
//         });
//       } else {
//         mapRef.current.setView([location.latitude!, location.longitude!], 15);
//         markerRef.current.setLatLng([location.latitude!, location.longitude!]);
//         if (icon) markerRef.current.setIcon(icon);
//       }
//     };

//     loadLeaflet();
//   }, [location.latitude, location.longitude, iconPreview]);

//   /* Reverse geocode */
//   const updateLocationFromCoords = async (lat: number, lng: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//       );
//       const data = await res.json();

//       const newLocation: LocationData = {
//         latitude: lat,
//         longitude: lng,
//         address: data.display_name || "",
//         city:
//           data.address?.city ||
//           data.address?.town ||
//           data.address?.village ||
//           "",
//         country: data.address?.country || "",
//       };

//       setLocation(newLocation);
//       onLocationUpdate(newLocation);
//     } catch {
//       setError("Failed to fetch address");
//     }
//     setLoading(false);
//   };

//   /* GPS */
//   const getCurrentLocation = () => {
//     setLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (pos) =>
//         updateLocationFromCoords(pos.coords.latitude, pos.coords.longitude),
//       () => {
//         setError("Location permission denied");
//         setLoading(false);
//       }
//     );
//   };

//   /* Search */
//   const handleSearch = async (query: string) => {
//     if (!query.trim()) return;
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//         query
//       )}&limit=5`
//     );
//     setSearchResults(await res.json());
//   };

//   /* Icon upload */
//   const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIconFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setIconPreview(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   /* Save */
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!location.latitude || !location.longitude) {
//       setError("Select a location first");
//       return;
//     }
//     //   const handleSave = () => {
//     //   if (!location.latitude || !location.longitude) {
//     //     setError("Please select a location");
//     //     return;
//     //   }

//     //   onSave(location, iconFile);
//     // };

//     const formData = new FormData();
//     formData.append("location", JSON.stringify(location));
//     if (iconFile) formData.append("icon", iconFile);

//     // try {
//     //   const getdata = await fetch("/api/location", {
//     //     method: "POST",
//     //     body: formData,
//     //   });

//     //   console.log(getdata);
//     //   // alert("Business location saved!");
//     // } catch {
//     //   setError("Failed to save location");
//     // }

//     console.log(formData);
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
//       <h2 className="text-xl font-bold flex gap-2 mb-4">
//         <MapPin className="text-blue-600" />
//         Business Location
//       </h2>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex gap-2">
//           <X /> {error}
//         </div>
//       )}

//       <button
//         onClick={getCurrentLocation}
//         disabled={loading}
//         className="w-full bg-blue-600 text-white py-3 rounded mb-4"
//       >
//         <Navigation className="inline mr-2" />
//         {loading ? "Loading..." : "Use Current Location"}
//       </button>

//       <input
//         value={searchQuery}
//         onChange={(e) => {
//           setSearchQuery(e.target.value);
//           handleSearch(e.target.value);
//         }}
//         placeholder="Search business location..."
//         className="w-full p-3 border rounded mb-2"
//       />

//       {searchResults.map((r, i) => (
//         <button
//           key={i}
//           onClick={() =>
//             updateLocationFromCoords(parseFloat(r.lat), parseFloat(r.lon))
//           }
//           className="block w-full text-left p-3 hover:bg-gray-100"
//         >
//           {r.display_name}
//         </button>
//       ))}

//       {/* Icon Upload */}
//       <div className="my-4">
//         <label className="block mb-2 font-medium">Business Icon</label>
//         <input type="file" accept="image/*" onChange={handleIconUpload} />

//         {iconPreview && (
//           <img
//             src={iconPreview}
//             className="mt-2 w-12 h-12 rounded"
//             alt="icon preview"
//           />
//         )}
//       </div>

//       {location.latitude && location.longitude && (
//         <div className="border rounded overflow-hidden">
//           <div ref={mapContainerRef} className="h-[450px] w-full" />
//         </div>
//       )}
//       <button
//         onClick={handleSave}
//         disabled={saving}
//         className="mt-4 w-full bg-green-600 text-white py-3 rounded"
//       >
//         <Save className="inline mr-2" />
//         {saving ? "Saving..." : "Save Location"}
//       </button>
//     </div>
//   );
// };
// export default LocationTracker;

"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Save, X } from "lucide-react";

type LocationData = {
  latitude: number | null;
  longitude: number | null;
  address: string;
  city: string;
  country: string;
};

interface LocationTrackerProps {
  currentLocation: LocationData | null;
  onLocationUpdate: (locationData: LocationData) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

const LocationTracker: React.FC<LocationTrackerProps> = ({
  currentLocation,
  onLocationUpdate,
  onSave,
  saving,
}) => {
  const [location, setLocation] = useState<LocationData>(
    currentLocation || {
      latitude: null,
      longitude: null,
      address: "",
      city: "",
      country: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ✅ REQUIRED LEAFLET REFS */
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  /* Sync external location */
  useEffect(() => {
    if (currentLocation) setLocation(currentLocation);
  }, [currentLocation]);

  /* Initialize or update map */
  useEffect(() => {
    if (!location.latitude || !location.longitude) return;

    const loadLeaflet = async () => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!(window as any).L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = createMap;
        document.body.appendChild(script);
      } else {
        createMap();
      }
    };
    const createMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView(
          [location.latitude!, location.longitude!],
          15
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        }).addTo(mapRef.current);

        markerRef.current = L.marker(
          [location.latitude!, location.longitude!],
          { draggable: true }
        ).addTo(mapRef.current);

        markerRef.current.on("dragend", (e: any) => {
          const pos = e.target.getLatLng();
          updateLocationFromCoords(pos.lat, pos.lng);
        });

        mapRef.current.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          markerRef.current.setLatLng([lat, lng]);
          updateLocationFromCoords(lat, lng);
        });
      } else {
        mapRef.current.setView([location.latitude!, location.longitude!], 15);
        markerRef.current.setLatLng([location.latitude!, location.longitude!]);
      }
    };

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location.latitude, location.longitude]);

  /* Reverse geocode */
  const updateLocationFromCoords = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      const newLocation: LocationData = {
        latitude: lat,
        longitude: lng,
        address: data.display_name || "",
        city:
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          "",
        country: data.address?.country || "",
      };

      setLocation(newLocation);
      onLocationUpdate(newLocation);
    } catch {
      setError("Failed to fetch address.");
    }
    setLoading(false);
  };

  /* Current location */
  const getCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocationFromCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  /* Search */
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearching(true);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5`
    );

    const data = await res.json();
    setSearchResults(data);
    setSearching(false);
  };

  const onSearchChange = (val: string) => {
    setSearchQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      handleSearch(val);
    }, 500);
  };

  const selectSearchResult = (r: SearchResult) => {
    updateLocationFromCoords(parseFloat(r.lat), parseFloat(r.lon));
    setSearchResults([]);
    setSearchQuery("");
  };

  // /* Save */
  // const handleSave = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!location.latitude || !location.longitude) {
  //     setError("Please select a location");
  //     return;
  //   }
  //   onSave(e);
  // };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.latitude || !location.longitude) {
      setError("Please select a location");
      return;
    }

    try {
      const get = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });

      console.log(get);

      alert("Location saved successfully!");
    } catch (error) {
      console.error(error);
      setError("Failed to save location");
    }
  };

  return (
    <div className="b dark:bg-gray-900 p-6 rounded-lg border">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <MapPin className="text-blue-600" />
        Business Location
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex gap-2">
          <X />
          {error}
        </div>
      )}

      <button
        onClick={getCurrentLocation}
        disabled={loading}
        className="w-full mb-4 bg-blue-600 text-white py-3 rounded"
      >
        <Navigation className="inline mr-2" />
        {loading ? "Loading..." : "Use Current Location"}
      </button>

      <input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search location..."
        className="w-full p-3 border rounded mb-2"
      />

      {searchResults.map((r, i) => (
        <button
          key={i}
          onClick={() => selectSearchResult(r)}
          className="block w-full text-left p-3 hover:bg-gray-100"
        >
          {r.display_name}
        </button>
      ))}

      {location.latitude && location.longitude && (
        <div className="mt-4 border rounded overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-[450px]" />
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 w-full bg-orange-600 text-white py-3 rounded"
      >
        <Save className="inline mr-2" />
        {saving ? "Saving..." : "Save Location"}
      </button>
    </div>
  );
};

export default LocationTracker;
