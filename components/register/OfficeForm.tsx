type Props = {
  officeName: string;
  setOfficeName: (v: string) => void;

  location: string;
  setLocation: (v: string) => void;

  phone: number | "";
  setPhone: (v: number | "") => void;

  openingMinutes: number | "";
  setOpeningMinutes: (v: number | "") => void;

  closingMinutes: number | "";
  setClosingMinutes: (v: number | "") => void;

  loading: boolean;
};

function getHour(total: number | "") {
  if (total === "") return "";
  return Math.floor(total / 60);
}

function getMinute(total: number | "") {
  if (total === "") return "";
  return total % 60;
}

export default function OfficeForm({
  officeName,
  setOfficeName,
  location,
  setLocation,
  phone,
  setPhone,
  openingMinutes,
  setOpeningMinutes,
  closingMinutes,
  setClosingMinutes,
  loading,
}: Props) {
  return (
    <>
      <div className="field field-full">
        <label>Nome da oficina</label>
        <input
          value={officeName}
          onChange={(e) => setOfficeName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="field">
        <label>Localização</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="field">
        <label>Telefone</label>
        <input
          type="number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value === "" ? "" : Number(e.target.value))
          }
          disabled={loading}
        />
      </div>

      <div className="field">
        <label>Abertura</label>
        <div className="time-row">
          <input
            type="number"
            min={0}
            max={23}
            placeholder="HH"
            value={getHour(openingMinutes)}
            onChange={(e) => {
              const h = e.target.value === "" ? "" : Number(e.target.value);
              const m = getMinute(openingMinutes) || 0;
              setOpeningMinutes(h === "" ? "" : h * 60 + m);
            }}
            disabled={loading}
          />
          <span>:</span>
          <input
            type="number"
            min={0}
            max={59}
            placeholder="MM"
            value={getMinute(openingMinutes)}
            onChange={(e) => {
              const m = e.target.value === "" ? "" : Number(e.target.value);
              const h = getHour(openingMinutes) || 0;
              setOpeningMinutes(m === "" ? "" : h * 60 + m);
            }}
            disabled={loading}
          />
        </div>
      </div>

      <div className="field">
        <label>Fecho</label>
        <div className="time-row">
          <input
            type="number"
            min={0}
            max={23}
            placeholder="HH"
            value={getHour(closingMinutes)}
            onChange={(e) => {
              const h = e.target.value === "" ? "" : Number(e.target.value);
              const m = getMinute(closingMinutes) || 0;
              setClosingMinutes(h === "" ? "" : h * 60 + m);
            }}
            disabled={loading}
          />
          <span>:</span>
          <input
            type="number"
            min={0}
            max={59}
            placeholder="MM"
            value={getMinute(closingMinutes)}
            onChange={(e) => {
              const m = e.target.value === "" ? "" : Number(e.target.value);
              const h = getHour(closingMinutes) || 0;
              setClosingMinutes(m === "" ? "" : h * 60 + m);
            }}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
}
