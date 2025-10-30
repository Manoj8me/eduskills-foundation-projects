import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import { Building2, X, ArrowLeft } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// College data with district coordinates
const collegeData = {
  Gujarat: {
    districts: [
      {
        name: "Mehsana",
        colleges: 1,
        coordinates: [23.588, 72.3693],
        collegeNames: ["Ganpat University"],
      },
      {
        name: "Gandhinagar",
        colleges: 4,
        coordinates: [23.2156, 72.6369],
        collegeNames: [
          "DAIICT",
          "PDPU",
          "NIFT Gandhinagar",
          "Gujarat National Law University",
        ],
      },
      {
        name: "Ahmedabad",
        colleges: 4,
        coordinates: [23.0225, 72.5714],
        collegeNames: [
          "IIM Ahmedabad",
          "CEPT University",
          "Gujarat University",
          "Nirma University",
        ],
      },
    ],
  },
  Karnataka: {
    districts: [
      {
        name: "Bangalore",
        colleges: 12,
        coordinates: [12.9716, 77.5946],
        collegeNames: [
          "Indian Institute of Science",
          "IIM Bangalore",
          "NIFT Bangalore",
          "Christ University",
          "PES University",
          "RV College of Engineering",
          "BMS College of Engineering",
          "MS Ramaiah Institute of Technology",
          "Bangalore University",
          "Jain University",
          "CMRIT",
          "New Horizon College of Engineering",
        ],
      },
      {
        name: "Mysore",
        colleges: 5,
        coordinates: [12.2958, 76.6394],
        collegeNames: [
          "University of Mysore",
          "JSS Science and Technology University",
          "SJCE Mysore",
          "NIE Mysore",
          "Mysore Medical College",
        ],
      },
    ],
  },
  Maharashtra: {
    districts: [
      {
        name: "Mumbai",
        colleges: 8,
        coordinates: [19.076, 72.8777],
        collegeNames: [
          "IIT Bombay",
          "VJTI Mumbai",
          "St. Xavier's College",
          "Narsee Monjee Institute of Management Studies",
          "Tata Institute of Social Sciences",
          "SP Jain Institute of Management",
          "KC College",
          "HR College of Commerce",
        ],
      },
      {
        name: "Pune",
        colleges: 6,
        coordinates: [18.5204, 73.8567],
        collegeNames: [
          "College of Engineering Pune",
          "Fergusson College",
          "Symbiosis Institute of Technology",
          "MIT World Peace University",
          "BITS Pilani Pune",
          "Army Institute of Technology",
        ],
      },
    ],
  },
  "Tamil Nadu": {
    districts: [
      {
        name: "Chennai",
        colleges: 10,
        coordinates: [13.0827, 80.2707],
        collegeNames: [
          "IIT Madras",
          "Anna University",
          "Loyola College",
          "Madras Christian College",
          "SRM University",
          "VIT Chennai",
          "Stella Maris College",
          "DG Vaishnav College",
          "New College Chennai",
          "Ethiraj College",
        ],
      },
      {
        name: "Coimbatore",
        colleges: 7,
        coordinates: [11.0168, 76.9558],
        collegeNames: [
          "PSG College of Technology",
          "Coimbatore Institute of Technology",
          "Kumaraguru College of Technology",
          "Amrita Vishwa Vidyapeetham",
          "Sri Krishna College of Engineering",
          "Hindusthan College of Engineering",
          "Government College of Technology",
        ],
      },
    ],
  },
  Kerala: {
    districts: [
      {
        name: "Thiruvananthapuram",
        colleges: 5,
        coordinates: [8.5241, 76.9366],
        collegeNames: [
          "College of Engineering Trivandrum",
          "Government Medical College",
          "University of Kerala",
          "Indian Institute of Space Science and Technology",
          "Mar Ivanios College",
        ],
      },
      {
        name: "Kochi",
        colleges: 6,
        coordinates: [9.9312, 76.2673],
        collegeNames: [
          "Cochin University of Science and Technology",
          "St. Albert's College",
          "Sacred Heart College",
          "Maharaja's College",
          "Model Engineering College",
          "Rajagiri College of Social Sciences",
        ],
      },
    ],
  },
  Punjab: {
    districts: [
      {
        name: "Chandigarh",
        colleges: 5,
        coordinates: [30.7333, 76.7794],
        collegeNames: [
          "Punjab Engineering College",
          "Post Graduate Government College",
          "MCM DAV College",
          "Government Medical College",
          "DAV College Chandigarh",
        ],
      },
      {
        name: "Amritsar",
        colleges: 4,
        coordinates: [31.634, 74.8723],
        collegeNames: [
          "Guru Nanak Dev University",
          "Khalsa College",
          "Government Medical College Amritsar",
          "DAV College Amritsar",
        ],
      },
    ],
  },
  "West Bengal": {
    districts: [
      {
        name: "Kolkata",
        colleges: 8,
        coordinates: [22.5726, 88.3639],
        collegeNames: [
          "Jadavpur University",
          "Presidency University",
          "St. Xavier's College",
          "Scottish Church College",
          "Lady Brabourne College",
          "Bethune College",
          "Maulana Azad College",
          "IIT Kharagpur - Kolkata Campus",
        ],
      },
      {
        name: "Durgapur",
        colleges: 3,
        coordinates: [23.5204, 87.3119],
        collegeNames: [
          "NIT Durgapur",
          "Bengal College of Engineering",
          "Dr. B.C. Roy Engineering College",
        ],
      },
    ],
  },
};

const createDistrictCountIcon = (count) => {
  const size = Math.max(25, Math.min(40, 25 + count * 2));
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
      background-color: #3B82F6;
      color: white;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${Math.max(12, Math.min(16, 12 + count))}px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const CollegeList = ({ colleges }) => {
  return (
    <div className="mt-2">
      <h3 className="font-semibold mb-2">Colleges:</h3>
      <ul className="space-y-1">
        {colleges.map((college, index) => (
          <li key={index} className="flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">{college}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DistrictMarkers = ({ selectedState, onDistrictClick }) => {
  const map = useMap();

  const handleMarkerClick = (coordinates) => {
    map.flyTo(coordinates, 10, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  };

  return (
    <>
      {Object.entries(collegeData).map(([stateName, data]) =>
        data.districts.map((district) => (
          <Marker
            key={`${stateName}-${district.name}`}
            position={district.coordinates}
            icon={createDistrictCountIcon(district.colleges)}
            eventHandlers={{
              click: () => {
                handleMarkerClick(district.coordinates);
                if (onDistrictClick) {
                  onDistrictClick(stateName, district.name);
                }
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{district.name}</div>
                <div className="text-xs text-gray-600">{stateName}</div>
                <div className="mt-1 font-medium text-blue-600">
                  {district.colleges}{" "}
                  {district.colleges === 1 ? "College" : "Colleges"}
                </div>
              </div>
            </Popup>
          </Marker>
        ))
      )}
    </>
  );
};

const stateNameMapping = {
  "Andhra Pradesh": "Telangana",
  Gujarat: "Gujarat",
  Karnataka: "Karnataka",
  Kerala: "Kerala",
  Maharashtra: "Maharashtra",
  Punjab: "Punjab",
  "Tamil Nadu": "Tamil Nadu",
  Telangana: "Telangana",
  "West Bengal": "West Bengal",
};

const DistrictList = ({ stateName, districts, onDistrictClick }) => {
  const [expandedDistrict, setExpandedDistrict] = useState(null);

  return (
    <div className="bg-white rounded-md shadow p-3">
      <div className="space-y-2">
        {districts.map((district, index) => (
          <div key={index} className="border-b last:border-b-0">
            <div
              className="py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setExpandedDistrict(
                  expandedDistrict === district.name ? null : district.name
                );
                if (onDistrictClick) {
                  onDistrictClick(stateName, district.name);
                }
              }}
            >
              <div className="font-medium">{district.name}</div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-medium">
                  {district.colleges}
                </span>
                <span className="text-gray-500">
                  {expandedDistrict === district.name ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>
            {expandedDistrict === district.name && (
              <div className="pb-2 pl-4">
                <CollegeList colleges={district.collegeNames || []} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MapController = ({ selectedState, stateGeometry, selectedDistrict }) => {
  const map = useMap();

  useEffect(() => {
    if (!selectedState) {
      map.flyTo([20.5937, 78.9629], 5, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    } else if (selectedDistrict) {
      const district = collegeData[selectedState].districts.find(
        (d) => d.name === selectedDistrict
      );
      if (district) {
        map.flyTo(district.coordinates, 10, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }
    } else if (stateGeometry) {
      const bounds = L.geoJSON(stateGeometry).getBounds();
      map.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [selectedState, stateGeometry, selectedDistrict, map]);

  return null;
};

const StateCard = ({ stateName, data, isSelected, onClick }) => {
  const totalColleges = data.districts.reduce(
    (sum, district) => sum + district.colleges,
    0
  );

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-md shadow p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-lg">{stateName}</h4>
        <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
          {totalColleges} Colleges
        </span>
      </div>
    </div>
  );
};

const InteractiveIndiaMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [indiaGeoJson, setIndiaGeoJson] = useState(null);
  const mapRef = useRef(null);
  const [selectedStateGeometry, setSelectedStateGeometry] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States"
    )
      .then((response) => response.json())
      .then((data) => setIndiaGeoJson(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  const handleStateClick = (event) => {
    try {
      let geoJsonStateName;
      let stateGeometry;

      if (event.target && event.target.feature) {
        geoJsonStateName = event.target.feature.properties.NAME_1;
        stateGeometry = event.target.feature;
      } else if (event.properties) {
        geoJsonStateName = event.properties.NAME_1;
        stateGeometry = event;
      }

      const mappedStateName =
        stateNameMapping[geoJsonStateName] || geoJsonStateName;

      if (collegeData[mappedStateName]) {
        if (selectedState === mappedStateName) {
          setSelectedState(null);
          setSelectedStateGeometry(null);
          setSelectedDistrict(null);
        } else {
          setSelectedState(mappedStateName);
          setSelectedStateGeometry(stateGeometry);
          setSelectedDistrict(null);

          // Force re-render of the GeoJSON layer
          if (mapRef.current) {
            const map = mapRef.current;
            map.invalidateSize();
          }
        }
      }
    } catch (error) {
      console.error("Error in handleStateClick:", error);
    }
  };

  const handleDistrictClick = (stateName, districtName) => {
    setSelectedState(stateName);
    setSelectedDistrict(districtName);
  };

  const stateStyle = (feature) => {
    const geoJsonStateName = feature.properties.NAME_1;
    const mappedStateName =
      stateNameMapping[geoJsonStateName] || geoJsonStateName;
    const hasColleges = Boolean(collegeData[mappedStateName]);

    return {
      fillColor: hasColleges
        ? selectedState === mappedStateName
          ? "#3B82F6"
          : "#93C5FD"
        : "#F3F4F6",
      weight: selectedState === mappedStateName ? 2 : 1,
      opacity: 1,
      color: selectedState === mappedStateName ? "#2563EB" : "white",
      fillOpacity: selectedState === mappedStateName ? 0.8 : 0.6,
      dashArray: selectedState === mappedStateName ? "" : "3",
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2">
      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="w-full h-96 relative">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="w-full h-full"
            zoomControl={false}
            ref={mapRef}
            style={{ zIndex: 1 }}
          >
            <ZoomControl position="topleft" />
            <MapController
              selectedState={selectedState}
              stateGeometry={selectedStateGeometry}
              selectedDistrict={selectedDistrict}
            />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {indiaGeoJson && (
              <GeoJSON
                data={indiaGeoJson}
                style={stateStyle}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    click: () => handleStateClick(feature),
                    mouseover: (e) => {
                      const geoJsonStateName =
                        e.target.feature.properties.NAME_1;
                      const mappedStateName =
                        stateNameMapping[geoJsonStateName] || geoJsonStateName;
                      if (collegeData[mappedStateName]) {
                        e.target.setStyle({
                          fillColor: "#60A5FA",
                        });
                      }
                    },
                    mouseout: (e) => {
                      e.target.setStyle(stateStyle(feature));
                    },
                  });
                }}
              />
            )}
            <DistrictMarkers
              selectedState={selectedState}
              onDistrictClick={handleDistrictClick}
            />
          </MapContainer>
        </div>
      </div>

      <div className="mt-2">
        {selectedState ? (
          <div id="state-details" className="space-y-2">
            <div className="flex items-center justify-between bg-white rounded-md shadow p-2">
              <button
                onClick={() => {
                  setSelectedState(null);
                  setSelectedStateGeometry(null);
                  setSelectedDistrict(null);
                }}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to All States
              </button>
              <h3 className="font-semibold text-lg">{selectedState}</h3>
            </div>
            <DistrictList
              stateName={selectedState}
              districts={collegeData[selectedState].districts}
              onDistrictClick={handleDistrictClick}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(collegeData).map(([stateName, data]) => (
              <StateCard
                key={stateName}
                stateName={stateName}
                data={data}
                isSelected={selectedState === stateName}
                onClick={() => {
                  if (!indiaGeoJson) return;

                  const stateFeature = indiaGeoJson.features.find((feature) => {
                    const geoJsonStateName = feature.properties.NAME_1;
                    const mappedName =
                      stateNameMapping[geoJsonStateName] || geoJsonStateName;
                    return mappedName === stateName;
                  });

                  if (stateFeature) {
                    handleStateClick(stateFeature);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveIndiaMap;
