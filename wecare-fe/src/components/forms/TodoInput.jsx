const TodoInput = () => {
  return (
    <TextInput
      style={styles.input}
      placeholder='할 일 제목을 입력해 주세요.'
      value={todoTitle}
      onChangeText={handleTitleChange}
      multiline={true}
      textAlignVertical='top'
    />
  );
};

export default TodoInput;
