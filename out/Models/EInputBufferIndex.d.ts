/**
 * Defines indices for action key buffer
 * Used to track input state across frames
 */
export declare const enum EInputBufferIndex {
    /**
     * Current frame input (set by input events)
     */
    Current = 0,
    /**
     * Previous frame input (set during update)
     */
    Previous = 1,
    /**
     * Pre-previous frame input (set during update)
     */
    PrePrevious = 2
}
