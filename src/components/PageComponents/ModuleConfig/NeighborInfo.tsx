import { useDevice } from "@app/core/stores/deviceStore.ts";
import type { NeighborInfoValidation } from "@app/validation/moduleConfig/neighborInfo.tsx";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { Protobuf, createProtobuf } from "@meshtastic/js";

export const NeighborInfo = (): JSX.Element => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: NeighborInfoValidation) => {
    setWorkingModuleConfig(
      createProtobuf(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "neighborInfo",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<NeighborInfoValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.neighborInfo}
      fieldGroups={[
        {
          label: "Neighbor Info Settings",
          description: "Settings for the Neighbor Info module",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Enabled",
              description: "Enable or disable Neighbor Info Module",
            },
            {
              type: "number",
              name: "updateInterval",
              label: "Update Interval",
              description:
                "Interval in seconds of how often we should try to send our Neighbor Info to the mesh",
              properties: {
                suffix: "Seconds",
              },
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
          ],
        },
      ]}
    />
  );
};
