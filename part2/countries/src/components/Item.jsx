import Country from './Country';

const Item = ({
  countryID,
  commonName,
  capitalCity,
  areaCode,
  lat,
  lon,
  languages,
  fullDetail,
  handleFullDetail,
}) => {
  const buttonLabel = fullDetail ? 'Hide' : 'Show';

  return (
    <div>
      {commonName}
      <button type="button" onClick={() => handleFullDetail(countryID)}>
        {buttonLabel}
      </button>
      <Country
        commonName={commonName}
        capitalCity={capitalCity}
        areaCode={areaCode}
        languages={languages}
        lat={lat}
        lon={lon}
        fullDetail={fullDetail}
      />
    </div>
  );
};

export default Item;
