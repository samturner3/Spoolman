import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  CrudSort,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DateField,
  CloneButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { NumberFieldUnit } from "../../components/numberField";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IFilament } from "./model";
import {
  genericSorter,
  getSortOrderForField,
} from "../../utils/sorting";

dayjs.extend(utc);

export const FilamentList: React.FC<IResourceComponentsProps> = () => {
  // Load sorter state from local storage
  const [sorters_initial] = React.useState<CrudSort[]>(() => {
    const storedSorters = localStorage.getItem("filamentListSorters");
    if (storedSorters) {
      return JSON.parse(storedSorters);
    }
    return [
      {
        field: "id",
        order: "asc",
      },
    ];
  });

  // Fetch data from the API
  const { tableProps, sorters } = useTable<IFilament>({
    syncWithLocation: false,
    pagination: {
      mode: "off", // Perform pagination in antd's Table instead. Otherwise client-side sorting/filtering doesn't work.
    },
    sorters: {
      mode: "off", // Disable server-side sorting
      initial: sorters_initial,
    },
  });

  // Store sorter state in local storage
  React.useEffect(() => {
    localStorage.setItem("filamentListSorters", JSON.stringify(sorters));
  }, [sorters]);

  // Copy dataSource to avoid mutating the original
  const dataSource = [...(tableProps.dataSource || [])];

  // Add a vendor_name field to the dataSource
  dataSource.forEach((element) => {
    if (element.vendor) {
      element.vendor_name = element.vendor.name;
    } else {
      element.vendor_name = null;
    }
  });

  // Sort dataSource by the sorters
  dataSource.sort(genericSorter(sorters));


  return (
    <List>
      <Table
        {...tableProps}
        dataSource={dataSource}
        pagination={{ showSizeChanger: true, pageSize: 20 }}
        rowKey="id"
      >
        <Table.Column
          dataIndex="id"
          title="Id"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "id")}
        />
        <Table.Column
          dataIndex="vendor_name"
          title="Vendor"
          sorter={true}
          defaultSortOrder={getSortOrderForField(
            sorters_initial,
            "vendor_name"
          )}
        />
        <Table.Column
          dataIndex="name"
          title="Name"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "name")}
        />
        <Table.Column
          dataIndex="material"
          title="Material"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "material")}
        />
        <Table.Column
          dataIndex="price"
          title="Price"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "price")}
        />
        <Table.Column
          dataIndex="density"
          title="Density"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "density")}
          render={(value) => (
            <NumberFieldUnit
              value={value}
              unit="g/cm³"
              options={{
                maximumFractionDigits: 2,
              }}
            />
          )}
        />
        <Table.Column
          dataIndex="diameter"
          title="Diameter"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "diameter")}
          render={(value) => (
            <NumberFieldUnit
              value={value}
              unit="mm"
              options={{
                maximumFractionDigits: 2,
              }}
            />
          )}
        />
        <Table.Column
          dataIndex="weight"
          title="Weight"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "weight")}
          render={(value) => {
            if (value === null || value === undefined) {
              return <></>;
            }
            return (
              <NumberFieldUnit
                value={value}
                unit="g"
                options={{
                  maximumFractionDigits: 1,
                }}
              />
            );
          }}
        />
        <Table.Column
          dataIndex="spool_weight"
          title="Spool Weight"
          sorter={true}
          defaultSortOrder={getSortOrderForField(
            sorters_initial,
            "spool_weight"
          )}
          render={(value) => {
            if (value === null || value === undefined) {
              return <></>;
            }
            return (
              <NumberFieldUnit
                value={value}
                unit="g"
                options={{
                  maximumFractionDigits: 1,
                }}
              />
            );
          }}
        />
        <Table.Column
          dataIndex="article_number"
          title="Article Number"
          sorter={true}
          defaultSortOrder={getSortOrderForField(
            sorters_initial,
            "article_number"
          )}
        />
        <Table.Column
          dataIndex={["registered"]}
          title="Registered"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "registered")}
          render={(value) => (
            <DateField
              value={dayjs.utc(value).local()}
              title={dayjs.utc(value).local().format()}
              format="YYYY-MM-DD HH:mm:ss"
            />
          )}
        />
        <Table.Column
          dataIndex={["comment"]}
          title="Comment"
          sorter={true}
          defaultSortOrder={getSortOrderForField(sorters_initial, "comment")}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton
                hideText
                title="Edit"
                size="small"
                recordItemId={record.id}
              />
              <ShowButton
                hideText
                title="Show"
                size="small"
                recordItemId={record.id}
              />
              <CloneButton
                hideText
                title="Clone"
                size="small"
                recordItemId={record.id}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
