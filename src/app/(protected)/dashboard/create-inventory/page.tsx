function CreateInventoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <div>query {searchParams.selection}</div>;
}

export default CreateInventoryPage;
