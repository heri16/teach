import React, { useRef, useMemo, useState, useCallback } from "react";
import "./input.css";

const App = ({ codeLength = 6 }) => {
    const CODE_LENGTH = useMemo(() => new Array(codeLength).fill(0), [codeLength]);

    const input = useRef(null);
    const displayRects = useRef([]);

    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const handleClick = useCallback(e => {
      const { index } = e.target.dataset;
      if (index) setValue(value.slice(0, index));
      input.current.focus();
    }, [value]);

    const handleKeyUp = useCallback(e => {
      if (e.key === "Backspace" || e.key === "Delete") {
        setValue(value.slice(0, value.length - 1));
      }
    }, [value]);

    const handleChange = useCallback(e => {
      const newValue = e.target.value;
      if (value.length < CODE_LENGTH.length) {
        setValue((value + newValue.trim()).slice(0, CODE_LENGTH.length));
      }
    }, [value]);

    const measuredRef = useCallback(node => {
      if (node !== null) {
        const { index } = node.dataset;
        if (index) {
          displayRects.current[index] = {
            left: node.offsetLeft,
            top: node.offsetTop,
            width: node.offsetWidth,
            height: node.offsetHeight,
          };
        }
      }
    }, []);

    const values = value.split("");

    const selectedIndex =
      values.length < CODE_LENGTH.length ? values.length : CODE_LENGTH.length - 1;

    const selectedRect = displayRects.current[selectedIndex];

    const hideInput = !(values.length < CODE_LENGTH.length);

    return (
      <div className="App">
        <div className="wrap" onClick={handleClick}>
          <input
            type="tel"
            autoComplete="one-time-code"
            value=""
            ref={input}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="input"
            style={{
              left: `${selectedRect ? selectedRect.left : selectedIndex * 32}px`,
              top: `${selectedRect ? selectedRect.top : 0}px`,
              width: `${selectedRect ? selectedRect.width : 32}px`,
              height: `${selectedRect ? selectedRect.height : 58}px`,
              opacity: hideInput ? 0 : 1,
            }}
          />
          {CODE_LENGTH.map((_v, index) => {
            const selected = values.length === index;
            const filled = values.length === CODE_LENGTH.length && index === CODE_LENGTH.length - 1;

            return (
              <div className="display" data-index={index} key={index} ref={measuredRef}>
                {values[index]}
                {(selected || filled) && focused && <div className="shadows" />}
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default App;
