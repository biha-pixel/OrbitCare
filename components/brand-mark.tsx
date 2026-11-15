/** Decorative mark; the enclosing home link supplies the accessible name. */
export default function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg className="brand-artwork" viewBox="0 0 64 64" focusable="false">
        <g transform="rotate(-38 32 32)">
          <ellipse className="brand-orbit" cx="32" cy="32" rx="25" ry="16" />
        </g>
        <svg className="brand-waveform" x="11" y="18" width="42" height="28" viewBox="0 0 42 28" overflow="hidden">
          <g className="brand-trace">
            <path className="brand-pulse" d="M0 14h7l3-3 3 3h4l3-11 4 22 4-14 3 3h11" />
            <path className="brand-pulse" transform="translate(42 0)" d="M0 14h7l3-3 3 3h4l3-11 4 22 4-14 3 3h11" />
          </g>
        </svg>
        <g transform="rotate(-38 32 32)">
          <circle className="brand-planetHalo" r="5.5" />
          <circle className="brand-planet" r="3.3" />
        </g>
      </svg>
    </span>
  );
}

