const leaves = Array.from({ length: 16 }, (_, index) => index);

export default function GoldLeafFrame() {
  return (
    <div className="gold-leaf-frame" aria-hidden="true">
      {leaves.map((leaf) => <span className="gold-leaf" key={leaf} />)}
    </div>
  );
}
