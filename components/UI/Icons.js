import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Text, StyleSheet } from "react-native";

export const FromIcon = () => <Text>🚩</Text>;
export const ToIcon = () => <Text>🏁</Text>;

const StyledIcon = ({ name, style = {}, size = 16, color = "white" }) => (
  <Icon
    name={name}
    size={size}
    color={color}
    style={[defaultIconStyle, style]}
  />
);

export const PlayIcon = (props) => <StyledIcon name="play" {...props} />;
export const CheckIcon = (props) => <StyledIcon name="check" {...props} />;
export const PencilIcon = (props) => <StyledIcon name="pencil" {...props} />;
export const TrashIcon = (props) => <StyledIcon name="trash" {...props} />;
export const PlusIcon = (props) => <StyledIcon name="plus" {...props} />;
export const SaveIcon = (props) => <StyledIcon name="save" {...props} />;

export const StartIcon = () => <PlayIcon />;
export const CompleteIcon = () => <CheckIcon />;
export const ModifyIcon = () => <PencilIcon />;
export const DeleteIcon = () => <TrashIcon />;
export const AddIcon = () => <PlusIcon />;

const defaultIconStyle = {
  color: "white",
  fontSize: 16,
  marginRight: 6,
};
