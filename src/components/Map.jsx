const Map = ({ country }) => {
    return (
        <div className="h-100 w-full overflow-hidden rounded-2xl">
            <iframe
                // title={`Map of ${country}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    country
                )}&hl=en&z=5&output=embed`}
                // allowFullScreen
            />
        </div>
    );
};

export default Map;