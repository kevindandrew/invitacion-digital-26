const leaves = Array.from({ length: 14 }, (_, index) => index);

export default function FlowerRain() {
  return (
    <div className="flower-rain" aria-hidden="true">
      {leaves.map((leaf) => <span className="flower-leaf" key={leaf} />)}
    </div>
  );
}
