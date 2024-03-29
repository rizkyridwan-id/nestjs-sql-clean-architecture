import { UserResponseDtoProps } from 'src/port/dto/user.response-dto.port';

export class UserResponseDto implements UserResponseDtoProps {
  /**
   *
   * @param props {UserResponse}
   *
   * Transform Plain object into Dto useful for whitelisting data,
   * this will avoid data leak, and preventing return a whole bunch
   * of data to client.
   */
  constructor(props: UserResponseDtoProps) {
    this.user_id = props.user_id;
    this.user_name = props.user_name;
    this.level = props.level;
  }

  user_id: string;
  user_name: string;
  level: string;
}
