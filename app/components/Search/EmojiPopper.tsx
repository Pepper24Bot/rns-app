import { Fade, Grid, Popper } from "@mui/material";
import EmojiPicker, { Theme } from "emoji-picker-react";
import React, { useEffect, useState } from "react";

interface EmojiPopperProps {
  anchorEl: HTMLElement | null;
  value: string;
  setValue: (value: string) => void;
  debounceFn: (value: string) => void;
}

export const EmojiPopper: React.FC<EmojiPopperProps> = (
  props: EmojiPopperProps
) => {
  const { anchorEl, value, setValue, debounceFn } = props;

  const [isChanged, setIsChanged] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [clientWidth, setClientWidth] = useState<number>(
    anchorEl?.clientWidth || 500
  );

  useEffect(() => {
    if (anchorEl?.clientWidth) {
      setClientWidth(anchorEl?.clientWidth);
    }
  }, [anchorEl?.clientWidth]);

  useEffect(() => {
    if (isChanged) {
      setValue(`${value}${fieldValue}`);
      debounceFn(`${value}${fieldValue}`);
      setIsChanged(false);
    }
  }, [isChanged]);

  return (
    <Popper
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="bottom"
      transition
      sx={{ zIndex: 1000 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Grid>
            <EmojiPicker
              className="emoji-popper"
              width={clientWidth}
              height={350}
              theme={Theme.DARK}
              skinTonesDisabled={true}
              previewConfig={{
                showPreview: false,
              }}
              onEmojiClick={(emoji) => {
                setFieldValue(emoji.emoji);
                /** hacky - check why value is not updating properly  */
                setIsChanged(true);
              }}
            />
          </Grid>
        </Fade>
      )}
    </Popper>
  );
};

export default EmojiPopper;
