import type { AtlasItem } from "../types/atlas";

type AtlasItemListProps = {
  items: AtlasItem[];
};

export function AtlasItemList({ items }: AtlasItemListProps) {
  return (
    <div className="atlas-item-list">
      {items.map((item) => (
        <article className="atlas-item" key={item.title}>
          <div className="atlas-item-meta">
            <span>{item.type}</span>
            <strong>{item.tag}</strong>
          </div>
          <div className="atlas-item-body">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <dl>
              <div>
                <dt>Architekturwert</dt>
                <dd>{item.whyItMatters}</dd>
              </div>
              <div>
                <dt>Trade-off</dt>
                <dd>{item.tradeoffs}</dd>
              </div>
            </dl>
          </div>
          <div className="atlas-item-side">
            <p>Failure Modes</p>
            <ul>
              {item.failureModes.map((mode) => (
                <li key={mode}>{mode}</li>
              ))}
            </ul>
            <div className="atlas-related" aria-label={`${item.title} Beziehungen`}>
              {item.related.map((entry) => (
                <span key={entry}>{entry}</span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
