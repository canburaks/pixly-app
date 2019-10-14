"use strict";

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var React = require('react'); // eslint-disable-line import/no-extraneous-dependencies


var _require = require('@emotion/is-prop-valid'),
    validAttr = _require.default;

var _require2 = require('../index'),
    cx = _require2.cx;

var warnIfInvalid = function warnIfInvalid(value, componentName) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof value === 'string' || // eslint-disable-next-line no-self-compare
    typeof value === 'number' && isFinite(value)) {
      return;
    }

    var stringified = typeof value === 'object' ? JSON.stringify(value) : String(value); // eslint-disable-next-line no-console

    console.warn("An inteprolation evaluated to '" + stringified + "' in the component '" + componentName + "', which is probably a mistake. You should explicitly cast or transform the value to a string.");
  }
};

function styled(tag) {
  return function (options) {
    if (process.env.NODE_ENV !== 'production') {
      if (Array.isArray(options)) {
        // We received a strings array since it's used as a tag
        throw new Error('Using the "styled" tag in runtime is not supported. Make sure you have set up the Babel plugin correctly. See https://github.com/callstack/linaria#setup');
      }
    }

    var render = function render(props, ref) {
      var _props$as = props.as,
          component = _props$as === void 0 ? tag : _props$as,
          className = props.class,
          rest = _objectWithoutPropertiesLoose(props, ["as", "class"]);

      var filteredProps; // Check if it's an HTML tag and not a custom element

      if (typeof component === 'string' && component.indexOf('-') === -1) {
        filteredProps = {}; // eslint-disable-next-line guard-for-in

        for (var _key in rest) {
          if (_key === 'as' || validAttr(_key)) {
            // Don't pass through invalid attributes to HTML elements
            filteredProps[_key] = rest[_key];
          }
        }
      } else {
        filteredProps = rest;
      }

      filteredProps.ref = ref;
      filteredProps.className = cx(filteredProps.className || className, options.class);
      var vars = options.vars;

      if (vars) {
        var style = {}; // eslint-disable-next-line guard-for-in

        for (var name in vars) {
          var _vars$name = vars[name],
              result = _vars$name[0],
              _vars$name$ = _vars$name[1],
              unit = _vars$name$ === void 0 ? '' : _vars$name$;
          var value = typeof result === 'function' ? result(props) : result;
          warnIfInvalid(value, options.name);
          style["--" + name] = "" + value + unit;
        }

        filteredProps.style = Object.assign(style, filteredProps.style);
      }
      /* $FlowFixMe */


      if (tag.__linaria && tag !== component) {
        // If the underlying tag is a styled component, forward the `as` prop
        // Otherwise the styles from the underlying component will be ignored
        filteredProps.as = component;
        return React.createElement(tag, filteredProps);
      }

      return React.createElement(component, filteredProps);
    };

    var Result = React.forwardRef ? React.forwardRef(render) : // React.forwardRef won't available on older React versions and in Preact
    // Fallback to a innerRef prop in that case
    function (_ref) {
      var innerRef = _ref.innerRef,
          rest = _objectWithoutPropertiesLoose(_ref, ["innerRef"]);

      return render(rest, innerRef);
    };
    Result.displayName = options.name; // These properties will be read by the babel plugin for interpolation

    /* $FlowFixMe */

    Result.__linaria = {
      className: options.class,
      extends: tag
    };
    return Result;
  };
}

if (process.env.NODE_ENV !== 'production') {
  module.exports = new Proxy(styled, {
    get: function get(o, prop) {
      return o(prop);
    }
  });
} else {
  module.exports = styled;
}
//# sourceMappingURL=styled.js.map