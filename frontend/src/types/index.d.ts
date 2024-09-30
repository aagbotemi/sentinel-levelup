interface ITable {
  tableHeaders: string[];
  tableData: any[];
  emptyTitle: string;
  emptySubTitle?: string;
  handlePagination?: (pageNumber: number) => void;
  hasPagination?: boolean;
  currentPage?: number;
  handleClickRow?: (e) => void;
  loading?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  setItemsPerPage: (args) => void;
}

interface IEmptyData {
  title: string;
  subTitle?: string;
}

interface IPagination {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (pageNumber: number) => void;
  setItemsPerPage: (args) => void;
  currentPage: number;
}

interface ISearchInput {
  placeholder: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  deleteSearchValue?: () => void;
  disabled?: boolean;
}

interface IDrawer {
  children: ReactNode;
  title: string;
  show: boolean | any;
  setShow: (value: boolean) => void;
  buttonData?: any[] | null;
  onClose?: () => void;
  testId?: string;
}

interface IDrawerChild {
  children: ReactNode;
  show: boolean;
}

interface ISingleTransaction {
  show: any;
  onClose: (args) => void;
}

interface ITrxRow {
  label: string;
  value: string;
  info?: string;
  isLink?: string;
  isCopy?: boolean;
  unit?: string;
}

interface INftContext {
  hasNft: boolean;
  checkNftOwnership: () => Promise<void>;
}
