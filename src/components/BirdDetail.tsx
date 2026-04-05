import type { Bird } from "../types/bird";

interface BirdDetailProps {
  bird: Bird;
  onClose: () => void;
}

export function BirdDetail({ bird, onClose }: BirdDetailProps) {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Stäng">
          ✕
        </button>
        <div className="detail-header">
          <h2 className="detail-swedish">
            {bird.swedish}
            {bird.extinct && <span className="extinct-badge"> †</span>}
          </h2>
          <p className="detail-scientific">{bird.scientific}</p>
        </div>
        <dl className="detail-fields">
          <div className="detail-row">
            <dt>Engelska</dt>
            <dd>{bird.english}</dd>
          </div>
          <div className="detail-row">
            <dt>Familj</dt>
            <dd>{bird.family}</dd>
          </div>
          {bird.order && (
            <div className="detail-row">
              <dt>Ordning</dt>
              <dd>{bird.order}</dd>
            </div>
          )}
          <div className="detail-row">
            <dt>NL-nummer</dt>
            <dd>{bird.nr}</dd>
          </div>
          {bird.extinct && (
            <div className="detail-row">
              <dt>Status</dt>
              <dd>Utdöd</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
