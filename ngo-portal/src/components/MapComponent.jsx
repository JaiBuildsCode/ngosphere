import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for missing marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ ngos }) => {
  return (
    <MapContainer 
      center={[20.5937, 78.9629]} 
      zoom={5} 
      scrollWheelZoom={false} // <--- THIS FIXES THE SCROLL ISSUE
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {ngos.map((ngo) => (
        <Marker key={ngo._id} position={ngo.coords || [20, 78]}>
          <Popup>
            <div style={{ textAlign: "center" }}>
                <b style={{ fontSize: "14px", color: "#1e293b" }}>{ngo.title}</b><br />
                <span style={{ fontSize: "12px", color: "#64748b" }}>{ngo.category}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;