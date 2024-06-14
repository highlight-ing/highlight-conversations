// app/conversations/page.tsx
import ConversationTable from '../components/ConversationTable';

const ConversationsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <ConversationTable />
    </div>
  );
};

export default ConversationsPage;
