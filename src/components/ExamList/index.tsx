import React from 'react';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';
import ListItem, { ExamsType } from './ListItem';

interface Props {
  exams: ExamsType[];
  onSelect: (id: string) => void;
}

const ExamList: React.FC<Props> = ({ exams, onSelect }) => {
  return (
    <FlatList
      data={exams}
      renderItem={exam => (
        <ListItem
          item={exam.item}
          onSelect={onSelect}
          right={props => <List.Icon {...props} icon="arrow-right" />}
        />
      )}
      keyExtractor={exam => exam.id}
    />
  );
};

export { ExamsType };
export default ExamList;
