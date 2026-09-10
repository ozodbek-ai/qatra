import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type SmoothInputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    wrapperClassName?: string;
    variant?: "default" | "error";
  };

const PASSWORD_CHAR = "•";

const NORMAL_SPRING = {
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

const REDUCED_MOTION_SPRING = {
  stiffness: 10000,
  damping: 100,
  mass: 0.1,
};

export const SmoothInput = forwardRef<
  HTMLInputElement,
  SmoothInputProps
>(
  (
    {
      className,
      wrapperClassName,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      type = "text",
      variant = "default",
      placeholder,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [internalValue, setInternalValue] =
      useState<string>(
        defaultValue !== undefined
          ? String(defaultValue)
          : "",
      );

    const prefersReducedMotion =
      useReducedMotion();

    const isControlled =
      value !== undefined;

    const inputValue = isControlled
      ? String(value)
      : internalValue;

    const caretLeft = useMotionValue(16);
    const caretOpacity = useMotionValue(0);

    const springCaretLeft = useSpring(
      caretLeft,
      prefersReducedMotion
        ? REDUCED_MOTION_SPRING
        : NORMAL_SPRING,
    );

    useImperativeHandle(
      forwardedRef,
      () => inputRef.current as HTMLInputElement,
    );

    /*
     * --------------------------------------------------
     * Canvas measurement
     * --------------------------------------------------
     */

    const getCanvasContext =
      useCallback((): CanvasRenderingContext2D | null => {
        if (typeof document === "undefined") {
          return null;
        }

        if (!canvasRef.current) {
          canvasRef.current =
            document.createElement("canvas");
        }

        return canvasRef.current.getContext("2d");
      }, []);

    const measureTextWidth = useCallback(
      (
        input: HTMLInputElement,
        text: string,
      ): number => {
        if (text.length === 0) {
          return 0;
        }

        const context =
          getCanvasContext();

        if (!context) {
          return 0;
        }

        const styles =
          window.getComputedStyle(input);

        let fontSize =
          styles.fontSize;

        /*
         * Password bullets are rendered slightly
         * differently by some browsers.
         */
        if (
          input.type === "password" &&
          !navigator.userAgent.match(
            /chrome|chromium|crios/i,
          )
        ) {
          fontSize = `${
            parseFloat(fontSize) + 6.25
          }px`;
        }

        context.font = [
          styles.fontStyle,
          styles.fontVariant,
          styles.fontWeight,
          fontSize,
          styles.fontFamily,
        ].join(" ");

        const measuredWidth =
          context.measureText(text).width;

        const letterSpacing =
          parseFloat(
            styles.letterSpacing,
          );

        const letterSpacingWidth =
          Number.isFinite(letterSpacing)
            ? letterSpacing * text.length
            : 0;

        return (
          measuredWidth +
          letterSpacingWidth
        );
      },
      [getCanvasContext],
    );

    /*
     * --------------------------------------------------
     * Caret position
     * --------------------------------------------------
     */

    const updateCaret = useCallback(
      (input: HTMLInputElement): void => {
        if (
          document.activeElement !== input
        ) {
          caretOpacity.set(0);
          return;
        }

        const selectionStart =
          input.selectionStart ?? 0;

        const selectionEnd =
          input.selectionEnd ?? 0;

        /*
         * When text is selected, hide the custom
         * caret just like the native browser caret.
         */
        if (
          selectionStart !== selectionEnd
        ) {
          caretOpacity.set(0);
          return;
        }

        const styles =
          window.getComputedStyle(input);

        const paddingLeft =
          parseFloat(
            styles.paddingLeft,
          ) || 0;

        const paddingRight =
          parseFloat(
            styles.paddingRight,
          ) || 0;

        /*
         * Text before the cursor.
         */
        const textBeforeCaret =
          input.type === "password"
            ? PASSWORD_CHAR.repeat(
                selectionStart,
              )
            : input.value.slice(
                0,
                selectionStart,
              );

        /*
         * Actual rendered text width.
         */
        const textWidth =
          measureTextWidth(
            input,
            textBeforeCaret,
          );

        /*
         * Absolute position inside the input.
         */
        const absoluteCaretLeft =
          paddingLeft + textWidth;

        /*
         * Keep the browser's horizontal scroll
         * synchronized with the custom caret.
         */
        const visibleRight =
          input.scrollLeft +
          input.clientWidth -
          paddingRight;

        const visibleLeft =
          input.scrollLeft +
          paddingLeft;

        if (
          absoluteCaretLeft >
          visibleRight
        ) {
          input.scrollLeft =
            Math.min(
              absoluteCaretLeft -
                input.clientWidth +
                paddingRight,
              Math.max(
                0,
                input.scrollWidth -
                  input.clientWidth,
              ),
            );
        } else if (
          absoluteCaretLeft <
          visibleLeft
        ) {
          input.scrollLeft =
            Math.max(
              0,
              absoluteCaretLeft -
                paddingLeft,
            );
        }

        /*
         * Position after scroll adjustment.
         */
        const visibleCaretLeft =
          absoluteCaretLeft -
          input.scrollLeft;

        /*
         * The caret must remain inside the
         * input's visible area.
         */
        const minLeft =
          Math.max(0, paddingLeft - 1);

        const maxLeft =
          Math.max(
            minLeft,
            input.clientWidth -
              paddingRight,
          );

        const nextLeft =
          Math.max(
            minLeft,
            Math.min(
              visibleCaretLeft,
              maxLeft,
            ),
          );

        /*
         * THIS is the value that moves.
         *
         * We use `left` instead of `x`
         * so there is no transform-coordinate
         * ambiguity.
         */
        caretLeft.set(nextLeft);
        caretOpacity.set(1);
      },
      [
        caretLeft,
        caretOpacity,
        measureTextWidth,
      ],
    );

    const updateCaretRef =
      useRef(updateCaret);

    updateCaretRef.current =
      updateCaret;

    /*
     * --------------------------------------------------
     * Ref
     * --------------------------------------------------
     */

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;

        if (
          typeof forwardedRef === "function"
        ) {
          forwardedRef(node);
        } else if (
          forwardedRef
        ) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    /*
     * --------------------------------------------------
     * Change
     * --------------------------------------------------
     */

    const handleChange = useCallback(
      (
        event: ChangeEvent<HTMLInputElement>,
      ): void => {
        const input =
          event.currentTarget;

        if (!isControlled) {
          setInternalValue(
            input.value,
          );
        }

        onChange?.(event);

        /*
         * Browser first updates selectionStart,
         * then we calculate the new caret position.
         */
        requestAnimationFrame(() => {
          updateCaretRef.current(input);
        });
      },
      [
        isControlled,
        onChange,
      ],
    );

    /*
     * --------------------------------------------------
     * Focus
     * --------------------------------------------------
     */

    const handleFocus = useCallback(
      (
        event: FocusEvent<HTMLInputElement>,
      ): void => {
        onFocus?.(event);

        requestAnimationFrame(() => {
          updateCaretRef.current(
            event.currentTarget,
          );
        });
      },
      [onFocus],
    );

    /*
     * --------------------------------------------------
     * Blur
     * --------------------------------------------------
     */

    const handleBlur = useCallback(
      (
        event: FocusEvent<HTMLInputElement>,
      ): void => {
        caretOpacity.set(0);

        onBlur?.(event);
      },
      [
        caretOpacity,
        onBlur,
      ],
    );

    /*
     * --------------------------------------------------
     * React value update
     * --------------------------------------------------
     */

    useEffect(() => {
      const input =
        inputRef.current;

      if (!input) {
        return;
      }

      requestAnimationFrame(() => {
        if (
          document.activeElement ===
          input
        ) {
          updateCaretRef.current(
            input,
          );
        }
      });
    }, [inputValue]);

    /*
     * --------------------------------------------------
     * Native browser events
     * --------------------------------------------------
     */

    useEffect(() => {
      const input =
        inputRef.current;

      const container =
        containerRef.current;

      if (!input || !container) {
        return;
      }

      const updateIfFocused =
        (): void => {
          if (
            document.activeElement !==
            input
          ) {
            return;
          }

          updateCaretRef.current(
            input,
          );
        };

      const handleSelectionChange =
        (): void => {
          if (
            document.activeElement !==
            input
          ) {
            return;
          }

          requestAnimationFrame(
            updateIfFocused,
          );
        };

      const handleKeyboard =
        (): void => {
          requestAnimationFrame(
            updateIfFocused,
          );
        };

      const handleClick =
        (): void => {
          requestAnimationFrame(
            updateIfFocused,
          );
        };

      document.addEventListener(
        "selectionchange",
        handleSelectionChange,
      );

      input.addEventListener(
        "keyup",
        handleKeyboard,
      );

      input.addEventListener(
        "click",
        handleClick,
      );

      input.addEventListener(
        "select",
        handleClick,
      );

      input.addEventListener(
        "scroll",
        updateIfFocused,
      );

      document.fonts.addEventListener(
        "loadingdone",
        updateIfFocused,
      );

      void document.fonts.ready.then(
        updateIfFocused,
      );

      const resizeObserver =
        new ResizeObserver(
          updateIfFocused,
        );

      resizeObserver.observe(
        container,
      );

      return () => {
        document.removeEventListener(
          "selectionchange",
          handleSelectionChange,
        );

        input.removeEventListener(
          "keyup",
          handleKeyboard,
        );

        input.removeEventListener(
          "click",
          handleClick,
        );

        input.removeEventListener(
          "select",
          handleClick,
        );

        input.removeEventListener(
          "scroll",
          updateIfFocused,
        );

        document.fonts.removeEventListener(
          "loadingdone",
          updateIfFocused,
        );

        resizeObserver.disconnect();
      };
    }, []);

    /*
     * --------------------------------------------------
     * Border
     * --------------------------------------------------
     */

    const borderClass =
      variant === "error"
        ? [
            "border-red-500",
            "focus-within:border-red-500",
            "focus-within:ring-4",
            "focus-within:ring-red-500/10",
          ].join(" ")
        : [
            "border-[var(--color-border)]",
            "focus-within:border-[var(--color-primary)]",
            "focus-within:ring-4",
            "focus-within:ring-[var(--color-primary)]/10",
          ].join(" ");

    /*
     * --------------------------------------------------
     * Render
     * --------------------------------------------------
     */

    return (
      <div
        className={cn(
          "relative flex w-full items-center rounded-xl border bg-[var(--color-background)] transition-all duration-200 ease-out",
          borderClass,
          wrapperClassName,
        )}
      >
        <div
          ref={containerRef}
          className="relative w-full"
        >
          <input
            {...props}
            ref={setInputRef}
            type={type}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "w-full bg-transparent px-4 py-4 text-lg font-medium tracking-[-0.01em] text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)] placeholder:opacity-70",
              className,
            )}
            style={{
              ...style,
              caretColor: "transparent",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-20 h-[1.25em] w-[2px] -translate-y-1/2 rounded-full bg-blue-500"
            style={{
              left: springCaretLeft,
              opacity: caretOpacity,
            }}
          >
            <span
              className="block h-full w-full"
              style={{
                animation:
                  "smooth-caret-blink 1s steps(1, end) infinite",
              }}
            />
          </motion.div>
        </div>
      </div>
    );
  },
);

SmoothInput.displayName =
  "SmoothInput";

